import { Component, createSignal, lazy, onMount, Show, Suspense } from 'solid-js';

const Save = lazy(() => import('./components/Save.tsx'));
const Auth = lazy(() => import('./components/auth/Auth.tsx'));

import Session from 'supertokens-web-js/recipe/session';

export const [showPopup, setShowPopup] = createSignal({ show: false, content: {} } as {
  show: boolean;
  content: {};
});
export const [isLoggedIn, setIsLoggedIn] = createSignal<boolean>();

const App: Component = () => {
  onMount(async () => {
    if (await Session.doesSessionExist()) {
      setIsLoggedIn(true);
    }
  });

  return (
    <div>
      <Show
        when={isLoggedIn()}
        fallback={
          <Suspense fallback={<p>Loading...</p>}>
            <Auth />
          </Suspense>
        }
      >
        <Suspense fallback={<p>Loading...</p>}>
          <Save />
        </Suspense>
      </Show>
    </div>
  );
};

export default App;
