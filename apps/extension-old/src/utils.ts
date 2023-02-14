import { AxiosInstance } from 'axios';

// eslint-disable-next-line import/no-mutable-exports
let axiosInstance: AxiosInstance;

/**
 * Check if the current domain is the API domain
 *
 * @param str - Domain name
 * @returns - True if the domain is the API domain
 */
function isApiDomain(str: string) {
  return str.startsWith('http://localhost:8200');
}

/**
 * Helper function to store cookie string correctly in localstorage
 *
 * @param respCookies - Cookie string received from backend
 */
async function setCookiesInLocalstorage(respCookies: string) {
  const { parse: parseSetCookieString, splitCookiesString } = await import('set-cookie-parser');

  if (respCookies) {
    // Split and parse cookies received
    const respCookieMap = parseSetCookieString(splitCookiesString(respCookies), {
      decodeValues: false,
      map: true,
    });

    // Check if we have anything stored already
    const localstorageCookies = localStorage.getItem('st-cookie');
    if (localstorageCookies !== null) {
      // Split and parse cookies we have in stored previously
      const splitStoredCookies = localstorageCookies.split('; ').map((cookie) => cookie.split('='));

      // eslint-disable-next-line no-restricted-syntax
      for (const [name, value] of splitStoredCookies) {
        // Keep old cookies if they weren't overwritten
        if (respCookieMap[name] === undefined) {
          respCookieMap[name] = { name, value };
        }
      }
    }

    // Save the combined cookies in a the format of a Cookie header
    // Please keep in mind that these have no expiration and lack many of the things done automatically for cookies
    // Many of these features can be implemented, but they are out of scope for this example
    localStorage.setItem(
      'st-cookie',
      Object.values(respCookieMap)
        .map((cookie: any) => `${cookie.name}=${cookie?.value}`)
        .join('; '),
    );
  }
}

/**
 * Add custom interceptors to fetch
 */
export function addCustomInterceptorsToGlobalFetch() {
  const origFetch = window.fetch;
  window.fetch = async (input: any, init) => {
    // Check if the we need to add the cookies
    if (isApiDomain(input.url || input)) {
      // Simply add the stored string into a header, it's already in the correct format.
      const stCookies = localStorage.getItem('st-cookie');
      if (stCookies) {
        const headers = new Headers(init?.headers);
        headers.append('st-cookie', stCookies);
        // eslint-disable-next-line no-param-reassign
        init = {
          ...init,
          headers,
        };
      }
    }

    const res = await origFetch(input, init);

    // Check if the we need to process the cookies in the response
    if (isApiDomain(input.url || input)) {
      const respCookies = res.headers.get('st-cookie');
      setCookiesInLocalstorage(respCookies);
    }
    return res;
  };
}

/**
 * Add custom interceptors to axios
 *
 * @param {AxiosInstance} input.axiosInstance - Axios instance
 * @param {any} input.userContext - User context
 *
 */
export function addCustomInterceptorToAxios(input: {
  axiosInstance: AxiosInstance;
  userContext: any;
}) {
  input.axiosInstance.interceptors.request.use(
    (config) => {
      // Check if the we need to add the cookies
      if (isApiDomain(config.url)) {
        const stCookies = localStorage.getItem('st-cookie');
        if (stCookies) {
          // Simply add the stored string into a header, it's already in the correct format.
          // eslint-disable-next-line no-param-reassign
          config.headers['st-cookie'] = stCookies;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  input.axiosInstance.interceptors.response.use(
    (res) => {
      // Check if the we need to process the cookies in the response
      if (isApiDomain(res.config.url)) {
        const respCookies = res.headers['st-cookie'];

        setCookiesInLocalstorage(respCookies);
      }
      return res;
    },
    // We need to process error responses as well
    (error) => {
      // Check if the we need to process the cookies in the response
      if (isApiDomain(error.config.url)) {
        const res = error.response;
        const respCookies = res.headers['st-cookie'];

        setCookiesInLocalstorage(respCookies);
      }
      return Promise.reject(error);
    },
  );
}

/**
 * Enum for color classes used in status messages
 *
 * @enum {string} ColorClasses - Tailwind CSS color classes
 */
export enum ColorClasses {
  success = 'text-green-400',
  error = 'text-red-400',
}

/**
 * Add status message to popup
 *
 * @param {string} message - Message to display
 * @param  {string} colorClass - Tailwind CSS color class
 */
export function addMessage(message: string, colorClass: string) {
  const statusDiv = document.querySelector<HTMLDivElement>('.status');

  // Check if status already exists
  if (statusDiv?.firstChild) {
    statusDiv.removeChild(statusDiv.firstChild);
  }

  // Create response message
  const responseMessage = document.createElement('p');
  responseMessage.classList.add(colorClass, 'mb-1', 'fade-in');
  responseMessage.innerText = message;
  statusDiv.appendChild(responseMessage);
}

/**
 * Create axios instance with interceptors to add auth headers
 *
 * @returns {Promise<AxiosInstance>} - Axios instance
 */
export async function createAxiosInstance(): Promise<AxiosInstance> {
  const { default: axios } = await import('axios');
  const Session = await import('supertokens-web-js/recipe/session');

  axiosInstance = axios.create({ withCredentials: true });
  Session.addAxiosInterceptors(axiosInstance);

  return axiosInstance;
}

export { axiosInstance };
