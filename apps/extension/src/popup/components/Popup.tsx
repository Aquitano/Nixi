import { Component } from 'solid-js';
import styles from './Popup.module.css';

type PopupContent = {
  content: object;
};

// @ts-expect-error
const Popup: Component = (props: PopupContent) => {
  console.log('props', props);

  if (!props) {
    return null;
  }

  return (
    <div class={"fixed px-2 rounded-xl " + styles.fadeIn + " " + props.content.colorClass}>
      <p class="text-center">{props.content.message}</p>
    </div>
  );
};

export default Popup;
