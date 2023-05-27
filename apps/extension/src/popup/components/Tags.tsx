import Tagify from '@yaireo/tagify';
import { Component, createSignal, onMount } from 'solid-js';
import { articleId } from '../App';

interface BeforeAddDetails {
  data: {
    value: string;
    __isValid: boolean;
    __tagId: string;
  };
}

export interface Tag {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  profileId: string;
}

const API_URL = 'http://localhost:8200/articles';

/**
 * Fetches data from the API
 *
 * @param {string} path
 * @param {object} [options={}]
 * @returns {Promise<any>}
 * @throws {Error}
 */
async function fetchAPI(path: string, options: object = {}): Promise<unknown> {
  const response = await fetch(`${API_URL}/${path}`, options);
  if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
  return response.json();
}

/**
 * Checks if the tag already exists in the database
 *
 * @param {string} tag
 * @returns {Promise<Tag>}
 */
async function doesTagExist(tag: string): Promise<Tag> {
  try {
    return (await fetchAPI(`tags/name/${tag}`)) as Tag;
  } catch {
    return null;
  }
}

/**
 * Adds a tag to the database
 *
 * @param {BeforeAddDetails} tag
 * @returns {Promise<void>}
 */
async function addTags(tag: BeforeAddDetails): Promise<void> {
  const dbTag = await doesTagExist(tag.data.value);
  let data: Tag;

  if (!dbTag) {
    const response = await fetchAPI('tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tag.data.value }),
    });
    data = response as Tag;
  } else {
    data = dbTag as Tag;
  }

  console.log(`Tag: ${data.name} ID: ${data.id}`);

  await fetchAPI(`tags/${articleId()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tagId: data.id }),
  });
}

const Tags: Component = () => {
  const [tagify, setTagify] = createSignal<Tagify>(null);

  /**
   * Handles the beforeAdd event from Tagify
   *
   * @param {CustomEvent} e
   * @returns {void}
   */
  function beforeAdd(e: { detail: BeforeAddDetails }): void {
    const details = e.detail as BeforeAddDetails;
    console.log(details.data.value);

    // eslint-disable-next-line no-underscore-dangle
    if (details.data.__isValid) {
      addTags(details);
    }
  }

  /**
   * Handles the click event on the add button
   *
   * @returns {void}
   */
  function onAddButtonClick(): void {
    tagify().addEmptyTag();
  }

  onMount(() => {
    const input = document.querySelector('.customLook');
    const tag = new Tagify(input, {
      callbacks: {
        invalid: (e) => console.log('invalid', e.detail),
      },
      trim: true,
      dropdown: {
        position: 'text',
        enabled: 1,
      },
      editTags: false,
    });
    tag.on('edit:updated', beforeAdd);

    setTagify(tag);
  });

  return (
    <div class="border-none">
      <input class="customLook" />
      <button type="button" onClick={onAddButtonClick}>
        +
      </button>
    </div>
  );
};

export default Tags;
