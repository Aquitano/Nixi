import 'flowbite';
import { Component, createSignal, lazy, Match, onMount, Suspense, Switch } from 'solid-js';
import { Toaster } from 'solid-toast';
import Session from 'supertokens-web-js/recipe/session';
import Skeleton from './components/Skeleton';

const Save = lazy(() => import('./components/Save'));
const Auth = lazy(() => import('./components/auth/Auth'));

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
			<div>
				<Toaster />
			</div>

			<Switch fallback={<h1>Error</h1>}>
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
