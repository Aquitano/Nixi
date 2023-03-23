import { Component, createEffect, createSignal, Show } from 'solid-js';
import { showPopup } from '../App.jsx';
import styles from './Popup.module.css';

const Popup: Component = () => {
  const [show, setShow] = createSignal(true);
  const [fadeIn, setFadeIn] = createSignal(true);

  function close(delay = 0) {
    setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        setShow(false);
      }, 500);
    }, delay);
  }

  createEffect(() => {
    if (showPopup().content) {
      setShow(true);
      setFadeIn(true);
      close(3000);
    }
  });

  return (
    <Show when={show()}>
      <div
        class={`fixed rounded-xl px-2 ${fadeIn() ? styles.fadeIn : styles.fadeOut} ${
          showPopup()?.content?.colorClass
        }`}
        onClick={() => close()}
      >
        <p class="text-center">{showPopup()?.content?.message}</p>
      </div>
    </Show>
  );
};

export default Popup;
