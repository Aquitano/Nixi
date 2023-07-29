import { Component, createSignal, lazy, Match, onMount, Show, Suspense, Switch } from 'solid-js';
import Session from 'supertokens-web-js/recipe/session';

import 'flowbite';
import Skeleton from './components/Skeleton';

const Save = lazy(() => import('./components/Save'));
const Auth = lazy(() => import('./components/auth/Auth'));
const Popup = lazy(() => import('./components/Popup'));

type PopupContent = {
	colorClass: string;
	message: string;
};

export const [showPopup, setShowPopup] = createSignal({ show: false, content: {} } as {
	show: boolean;
	content: PopupContent;
});
export const [isLoggedIn, setIsLoggedIn] = createSignal<boolean>(false);
export const [articleId, setArticleId] = createSignal<string>();

const App: Component = () => {
	onMount(() => {
		(async () => {
			const session = await Session.doesSessionExist();
			setIsLoggedIn(session);
		})();
	});

	return (
		<div>
			<Show when={showPopup().show}>
				<Popup />
			</Show>

			<Switch fallback={<h1>Error</h1>}>
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
				<Match when={!isLoggedIn()}>
					<Suspense fallback={<Skeleton />}>
						<Auth />
					</Suspense>
				</Match>
				<Match when={isLoggedIn()}>
					<Suspense fallback={<Skeleton />}>
						<Save />
					</Suspense>
				</Match>
			</Switch>
		</div>
	);
};

export default App;
