import { Component, createSignal, lazy, onMount, Show, Suspense } from 'solid-js';

const Save = lazy(() => import('./components/Save.tsx'));
const Auth = lazy(() => import('./components/auth/Auth.tsx'));
const Popup = lazy(() => import('./components/Popup.tsx'));

import Session from 'supertokens-web-js/recipe/session';

type PopupContent = {
  colorClass: string;
  message: string;
};

export const [showPopup, setShowPopup] = createSignal({ show: false, content: {} } as {
  show: boolean;
  content: PopupContent;
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
      <Show when={showPopup().show}>
        <Popup id="Error" />
      </Show>
      <Show
        when={isLoggedIn()}
        fallback={
          <Suspense fallback={<div>Loading...</div>}>
            <Auth />
          </Suspense>
        }
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Save />
        </Suspense>
      </Show>
    </div>
  );
};

export default App;
