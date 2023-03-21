import { Component, createEffect, createSignal, onMount, Show } from 'solid-js';
import { showPopup } from '../App.jsx';
import styles from './Popup.module.css';

const Popup: Component = () => {
  const [show, setShow] = createSignal<boolean>(true);

  function close(delay = 0) {
    setTimeout(() => {
      setShow(false);
      showPopup().content = null;
    }, delay);
  }

  onMount(() => {
    close(3000);
  });

  createEffect(() => {
    setShow(false); // reset animation

    if (showPopup().content) {
      setShow(true);
      close(3000);
    }
  });

  return (
    <Show when={show()} fallback={<div />}>
        <div
          class={`fixed rounded-xl px-2 ${styles.fadeIn} ${showPopup().content.colorClass}`}
          onClick={close}
        >
          <p class="text-center">{showPopup().content.message}</p>
        </div>
    </Show>
  );
};

export default Popup;
