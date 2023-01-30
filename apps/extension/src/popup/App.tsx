import { Component, createSignal, lazy, onMount, Show } from 'solid-js';
import { lazily } from 'solidjs-lazily';

import logo from '../assets/logo.svg';
import styles from './App.module.css';
import Popup from './components/Popup.jsx';

const Auth = lazy(() => import('./components/auth/Auth.tsx'));
const { logout } = lazily(() => import('./components/auth/utils.js'));

export const [showPopup, setShowPopup] = createSignal({ show: false, content: {} });

const App: Component = () => {
  const [isLoggedIn, setIsLoggedIn] = createSignal();

  // Check if user is logged in
  onMount(async () => {
    const { doesSessionExist } = lazily(() => import('supertokens-web-js/recipe/session'));
    const sessionExists = await doesSessionExist();
    setIsLoggedIn(sessionExists);
  });

  return (
    <div>
      <Show when={isLoggedIn()} fallback={<Auth />}>
        <div class={styles.App}>
          <header class={styles.header}>

            <Show when={showPopup().show}>
              <p>showPopup</p>
              {/* @ts-expect-error */}
              <Popup content={showPopup().content} />
            </Show>

            <img src={logo} class={styles.logo} alt="logo" />
            <p>
              Edit <code class="text-emerald-300">src/App.tsx</code> and save to reload.
            </p>
            <a
              class={styles.link}
              href="https://github.com/solidjs/solid"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Solid
            </a>
            <div>
              <a onClick={logout}>Logout</a>
            </div>
          </header>
        </div>
      </Show>

    </div>
  );
};

export default App;
