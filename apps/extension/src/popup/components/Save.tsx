import { Component, lazy, onMount, Show } from 'solid-js';
import { showPopup } from '../App.jsx';

const { logout } = lazily(
  () => import(/* @type {import('./auth/utils.js').LogoutFn} */ './auth/utils.js'),
);
const Popup = lazy(() => import('./Popup.tsx'));

import { lazily } from 'solidjs-lazily';
import logo from '../../assets/logo.svg';
import styles from './Save.module.css';

const Save: Component = () => {
  onMount(async () => {
    fetch('http://localhost:8200/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  });

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Show when={showPopup().show}>
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
  );
};

export default Save;
