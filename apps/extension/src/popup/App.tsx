import { Component, createSignal, lazy, Match, Show, Suspense, Switch } from 'solid-js';
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
	/**
	 * Checks if the user is logged in
	 *
	 * @returns {Promise<boolean>}
	 */
	async function userLoggedIn(): Promise<boolean> {
		const session = await Session.doesSessionExist();
		setIsLoggedIn(session);
		return session;
	}

	return (
		<div>
			<Show when={showPopup().show}>
				<Popup />
			</Show>

			<Switch fallback={<h1>Error</h1>}>
				<Match when={!userLoggedIn()}>
					<Suspense fallback={<Skeleton />}>
						<Auth />
					</Suspense>
				</Match>
				<Match when={userLoggedIn()}>
					<Suspense fallback={<Skeleton />}>
						<Save />
					</Suspense>
				</Match>
			</Switch>
		</div>
	);
};

export default App;
