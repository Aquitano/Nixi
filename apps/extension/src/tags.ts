const tagArray: string[] = [];

function createTag(e: KeyboardEvent, input: HTMLInputElement, tagPrompt: HTMLDivElement) {
  e.preventDefault();

  if (e.key === 'Enter') {
    const tagInput = input.value.trim();
    // Prevent empty tags
    if (tagInput === '') return;

    // Validate tag
    const inputValidation = tagInput.match(/^[a-zA-Z0-9]+$/);
    if (!inputValidation) return;

    // Prevent duplicate tags
    if (tagArray.includes(tagInput)) return;
    tagArray.push(tagInput);

    input.innerText = '';

    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.innerText = tagInput;
    tag.id = tagInput;

    tagPrompt.querySelector('#tag-input').insertBefore(tag, input);
  }

  console.log(e);
}

export async function addTagPrompt(id: string) {
  const { tagPromptHTML } = await import('./components');

  console.log(id);

  const tagPrompt = document.createElement('div');
  tagPrompt.innerHTML = tagPromptHTML;

  const input = tagPrompt.querySelector<HTMLInputElement>('#tag-input > input[type=text]');

  tagPrompt
    .querySelector('#tag-input > input[type=text]')
    .addEventListener('keyup', (e) => createTag(e as KeyboardEvent, input, tagPrompt));

  document.querySelector('#app > div > div.status').appendChild(tagPrompt);
}
