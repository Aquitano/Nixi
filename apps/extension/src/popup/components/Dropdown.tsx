import { Dropdown, DropdownOptions } from 'flowbite';
import { Component, For, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { type Tag } from '../../assets/schema/index';
import { addTag, createTag, doesTagExist, removeTag } from './article/TagHandler';
import { getUserTags } from './article/TagRetriever';

export const [items, setItems] = createStore<{ id: string; name: string; checked: boolean }[]>([]);

const DropdownItem: Component<{ id: string; name: string; checked: boolean }> = (props) => {
	const toggleTag = (id: string) => {
		// If not checked, add tag to database
		if (!props.checked) {
			addTag(id);
		} else {
			removeTag(id);
		}
	};

	return (
		<li>
			<div class="flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600">
				<input
					id="checkbox-item-11"
					type="checkbox"
					value=""
					checked={props.checked}
					class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
					onChange={() => toggleTag(props.id)}
				/>
				<label
					for="checkbox-item-11"
					class="ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					// onClick={() => toggleTag(props.name)}
				>
					{props.name}
				</label>
			</div>
		</li>
	);
};

const DropdownMain: Component<{ articleTags: Tag[] }> = (props) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [search, setSearch] = createSignal('');
	let dropdownButton: HTMLButtonElement | undefined;
	let dropdownMenu: HTMLDivElement | undefined;

	async function handleSearch(e: KeyboardEvent) {
		const searchData = (e.target as HTMLInputElement).value;

		setSearch(searchData);

		if (e.key === 'Enter' && !items.some((tag) => tag.name === searchData)) {
			let tagId = '';
			// Check if tag already exists in database
			// If not, add tag to database
			if (!(await doesTagExist(searchData))) {
				const tag = await createTag(searchData);

				// Add tag to dropdown
				setItems([...items, { id: tag.id, name: tag.name, checked: false }]);

				tagId = tag.id;

				console.log('tag created', searchData);
			} else {
				// TODO: Optimize this performance-wise
				tagId = (await getUserTags()).find((tag) => tag.name === searchData)?.id || '';
			}

			await addTag(tagId);
			return;
		}

		// TODO: filter dropdown items (fetch from API)
		console.log('search', searchData);
	}

	onMount(() => {
		(async () => {
			const options: DropdownOptions = {
				triggerType: 'click',
				offsetSkidding: 0,
				offsetDistance: 10,
				delay: 300,
			};

			const tags = await getUserTags();

			const checkedTags = props.articleTags.map((tag) => tag.id);

			console.log('checkedTags', checkedTags);

			setItems(
				tags.map((tag) => ({ id: tag.id, name: tag.name, checked: checkedTags.includes(tag.id) })),
			);

			// eslint-disable-next-line no-new
			new Dropdown(dropdownMenu, dropdownButton, options);
		})();
	});

	return (
		<>
			<button
				id="dropdownSearchButton"
				data-dropdown-toggle="dropdownSearch"
				data-dropdown-placement="bottom"
				class="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				type="button"
				ref={dropdownButton}
			>
				Add Tag
				<svg
					class="ml-2 h-4 w-4"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</button>

			<div
				id="dropdownSearch"
				class="dark z-10 hidden w-60 rounded-lg  bg-gray-700 shadow"
				ref={dropdownMenu}
			>
				<div class="p-3">
					<label for="input-group-search" class="sr-only">
						Search
					</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clip-rule="evenodd"
								></path>
							</svg>
						</div>
						<input
							type="text"
							id="input-group-search"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="Search tags"
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onKeyDown={(e) => handleSearch(e)}
						/>
					</div>
				</div>
				<ul
					class="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
					aria-labelledby="dropdownSearchButton"
				>
					<For each={items}>
						{(item) => <DropdownItem name={item.name} checked={item.checked} id={item.id} />}
					</For>
				</ul>
			</div>
		</>
	);
};

export default DropdownMain;
