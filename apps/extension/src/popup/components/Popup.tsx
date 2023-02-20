import { Component, createEffect, createSignal, Show } from 'solid-js';
import { showPopup } from '../App.jsx';
import styles from './Popup.module.css';

const Popup: Component = () => {
  const [show, setShow] = createSignal(true);

  createEffect(() => {
    if (showPopup().content) {
      setShow(true);
    }
  });

  if (!showPopup().content) {
    return <div />;
  }

  function close() {
    setShow(false);
  }

  return (
    <Show when={show()}>
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
