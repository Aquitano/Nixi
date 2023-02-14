import { Component, createSignal, lazy, onMount, Show, Suspense } from 'solid-js';
import { lazily } from 'solidjs-lazily';

const Save = lazy(() => import('./components/Save.tsx'));
const Auth = lazy(() => import('./components/auth/Auth.tsx'));
const { doesSessionExist } = lazily(() => import('supertokens-web-js/recipe/session'));

export const [showPopup, setShowPopup] = createSignal({ show: false, content: {} } as {
  show: boolean;
  content: {};
});
export const [isLoggedIn, setIsLoggedIn] = createSignal<boolean>();

const App: Component = () => {
  // Check if user is logged in
  onMount(async () => {
    console.log('Checking if user is logged in');
    console.log(isLoggedIn());
    // setIsLoggedIn(sessionExists);
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
