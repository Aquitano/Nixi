import Tagify from '@yaireo/tagify';
import { Component, createSignal, onMount } from 'solid-js';

interface BeforeAddDetails {
  data: {
    value: string;
    __isValid: boolean;
    __tagId: string;
  };
}

const Tags: Component = () => {
  const [tagify, setTagify] = createSignal<Tagify>(null);

  function beforeAdd(e) {
    const details: BeforeAddDetails = e.detail;
    console.log(details.data.value);
  }

  onMount(() => {
    const input = document.querySelector('.customLook');
    const tag = new Tagify(input, {
      callbacks: {
        invalid: (e) => console.log('invalid', e.detail),
      },
      trim: true,
      dropdown: {
        position: 'text',
        enabled: 1,
      },
      editTags: false,
    });
    tag.on('edit:updated', beforeAdd);

    setTagify(tag);
  });

  function onAddButtonClick() {
    tagify().addEmptyTag();
  }

  return (
    <div class="border-none">
      <input class="customLook" />
      <button type="button" onClick={onAddButtonClick}>
        +
      </button>
    </div>
  );
};

export default Tags;
