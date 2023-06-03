import Tagify from '@yaireo/tagify';
import { Component, createSignal, onMount } from 'solid-js';
import wretch from 'wretch';
import { Tag } from '../../assets/dto';
import { articleId } from '../App';

interface BeforeAddDetails {
  data: {
    value: string;
    __isValid: boolean;
    __tagId: string;
  };
}

const API_URL = 'http://localhost:8200/articles';

/**
 * Checks if the tag already exists in the database
 *
 * @param {string} tag
 * @returns {Promise<Tag | null>}
 */
async function doesTagExist(tag: string): Promise<Tag | null> {
  try {
    return await wretch(`${API_URL}/tags/name/${tag}`).get().json();
  } catch {
    return null;
  }
}

/**
 * Adds a tag to the database
 *
 * @param {BeforeAddDetails} tag
 * @returns {Promise<void>}
 */
async function addTags(tag: BeforeAddDetails): Promise<void> {
  const dbTag = await doesTagExist(tag.data.value);
  let data: Tag;

  if (!dbTag) {
    data = (await wretch(`${API_URL}/tags`).post({ name: tag.data.value }).json()) as Tag;
  } else {
    data = dbTag as Tag;
  }

  console.log(`Tag: ${data.name} ID: ${data.id}`);

  wretch(`${API_URL}/tags/${articleId()}`).post({ tagId: data.id });
}

const Tags: Component = () => {
  const [tagify, setTagify] = createSignal<Tagify>(null);

  /**
   * Handles the beforeAdd event from Tagify
   *
   * @param {CustomEvent} e
   * @returns {void}
   */
  function beforeAdd(e: { detail: BeforeAddDetails }): void {
    const details = e.detail as BeforeAddDetails;
    console.log(details.data.value);

    // eslint-disable-next-line no-underscore-dangle
    if (details.data.__isValid) {
      addTags(details);
    }
  }

  /**
   * Handles the click event on the add button
   *
   * @returns {void}
   */
  function onAddButtonClick(): void {
    tagify().addEmptyTag();
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
