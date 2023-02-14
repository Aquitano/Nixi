import { Component } from 'solid-js';
import styles from './Popup.module.css';

type PopupContent = {
  colorClass: string;
  message: string;
};

// @ts-expect-error
const Popup: Component = (props: { [key: string]: string; content: PopupContent }) => {
  console.log('props', props);

  if (!props.content) {
    return <div />;
  }

  return (
    <div class={'fixed rounded-xl px-2 ' + styles.fadeIn + ' ' + props.content.colorClass}>
      <p class="text-center">{props.content.message}</p>
    </div>
  );
};

export default Popup;
