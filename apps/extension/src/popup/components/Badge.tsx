import { Component, onMount } from 'solid-js';

// Function to select a random color from tailwindcss's color palette
function randomColor(): string {
  const colors = [
    'bg-red-800',
    'bg-orange-800',
    'bg-amber-800',
    'bg-yellow-800',
    'bg-lime-800',
    'bg-green-800',
    'bg-emerald-800',
    'bg-teal-800',
    'bg-cyan-800',
    'bg-sky-800',
    'bg-blue-800',
    'bg-indigo-800',
    'bg-violet-800',
    'bg-purple-800',
    'bg-fuchsia-800',
    'bg-pink-800',
    'bg-rose-800',
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

const Badge: Component<{ name: string }> = (props) => {
  onMount(() => {
    console.log(randomColor());
  });

  return (
    <span
      id="badge-dismiss-pink"
      class={`${randomColor()} mb-2 mr-2 inline-flex items-center rounded px-2 py-1 text-sm font-medium text-zinc-200 dark:bg-zinc-400 dark:text-blue-300`}
    >
      {props.name}
      <button
        type="button"
        class="ml-2 inline-flex items-center rounded-sm bg-transparent p-0.5 text-sm text-blue-400 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
        data-dismiss-target="#badge-dismiss-default"
        aria-label="Remove"
      >
        <svg
          aria-hidden="true"
          class="h-3.5 w-3.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="sr-only">Remove badge</span>
      </button>
    </span>
  );
};

export default Badge;
