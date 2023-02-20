import { Component, onMount } from 'solid-js';
import { lazily } from 'solidjs-lazily';
import logo from '../../assets/logo.svg';
import styles from './Save.module.css';

const { logout } = lazily(
  () => import(/* @type {import('./auth/utils.js').LogoutFn} */ './auth/utils.js'),
);

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
        <img src={logo} class={styles.logo} alt="logo" />

        <h1 class="text-xl font-bold">nixi</h1>

        <div class="px-8 py-8">
          <button
            type="button"
            class="rounded-2xl bg-emerald-500 transition duration-500 ease-in-out hover:bg-green-500"
          >
            Save Article
          </button>
        </div>

        <div class="absolute inset-x-0 bottom-0 text-sm">
          Built with Vite and TypeScript -{' '}
          <a onClick={logout} class="font-medium text-fuchsia-500 hover:text-fuchsia-300">
            Logout
          </a>
        </div>
      </header>
    </div>
  );
};

export default Save;
