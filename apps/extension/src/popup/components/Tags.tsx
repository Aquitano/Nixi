import { Component, For, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { type Tag } from '../../assets/schema';
import { articleId } from '../App';
import Badge from './Badge';
import DropdownMain from './Dropdown';
import { getArticleTags } from './article/TagRetriever';

export const [tags, setTags] = createStore<Tag[]>([]);

const Tags: Component = () => {
	onMount(() => {
		if (articleId()) {
			getArticleTags().then((data) => {
				setTags(data);
				console.log(data);
			});
		}
	});

	return (
		<>
			<For each={tags}>{(tag) => <Badge name={tag.name} id={tag.id} />}</For>
			<div class="mt-4">
				<DropdownMain articleTags={tags} />
			</div>
		</>
	);
};

export default Tags;
