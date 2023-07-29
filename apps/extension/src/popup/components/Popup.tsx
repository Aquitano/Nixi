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
						<button
							type="button"
							class={`fixed rounded-xl border-2 p-0 px-2 hover:opacity-75 ${showPopup()?.content
								?.colorClass}`}
							onClick={() => close()}
						>
							<p class="text-center">{showPopup()?.content?.message}</p>
						</button>
					</Motion>
				</Rerun>
			</Show>
		</Presence>
	);
};

export default Popup;
