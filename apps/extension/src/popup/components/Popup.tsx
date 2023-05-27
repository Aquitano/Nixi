import { Motion, Presence } from '@motionone/solid';
import { Rerun } from '@solid-primitives/keyed';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import { showPopup } from '../App.jsx';

const Popup: Component = () => {
  const [show, setShow] = createSignal(true);

  /**
   * Close the popup after a delay
   *
   * @param delay The delay in milliseconds
   */
  function close(delay = 0) {
    setTimeout(() => {
      setShow(false);
    }, delay);
  }

  createEffect(() => {
    if (showPopup().content) {
      setShow(true);
      close(3000);
    }
  });

  return (
    <Presence exitBeforeEnter>
      <Show when={show()}>
        <Rerun on={showPopup().content}>
          <Motion
            class={'fixed rounded-xl px-2'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              class={`fixed rounded-xl px-2 ${showPopup()?.content?.colorClass}`}
              onClick={() => close()}
              onKeyDown={() => close()}
            >
              <p class="text-center">{showPopup()?.content?.message}</p>
            </div>
          </Motion>
        </Rerun>
      </Show>
    </Presence>
  );
};

export default Popup;
