import { Component } from 'solid-js';

type PopupContent = {
  content: object;
};

// @ts-expect-error
const Popup: Component = (props: PopupContent) => {
  console.log('props', props);

  if (!props) {
    return null;
  }

  const content: { message?: string; colorClass?: string } = props.content;

  // Maybe no reactivity here
  // NO destructuring

  return (
    <div>
      <p>{content.message}</p>
    </div>
  );
};

export default Popup;
