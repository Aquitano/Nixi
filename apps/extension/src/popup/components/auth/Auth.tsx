import { Component, createSignal, For } from 'solid-js';
import { GitHub, Google } from '../Icons';
import { AuthState, useForm } from './utils';

/**
 * Text for the auth form - switch state, switch button, form button
 */
const authText = {
  switchState: {
    signIn: 'Not registered yet?',
    signUp: 'Already registered?',
  },
  switchButton: {
    signIn: 'Sign Up',
    signUp: 'Sign In',
  },
  formButton: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
  },
};

const Auth: Component = () => {
  const [authState, setAuthState] = createSignal<AuthState>('signIn');
  const toggleAuthState = () => setAuthState(authState() === 'signIn' ? 'signUp' : 'signIn');

  const { form, updateFormField, submit } = useForm();

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    submit(form, authState());
  };

  return (
    <div class="rounded-xl bg-slate-800 px-8 py-6">
      {/* Header */}
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-lg font-bold text-white">{authText.formButton[authState()]}</h1>
        <p class="text-slate-200" id="switch-auth-state">
          <span>{authText.switchState[authState()]}</span>
          <button
            type="button"
            class="reset cursor-pointer pl-1 text-indigo-500 transition-all duration-300 hover:text-indigo-800"
            onClick={toggleAuthState}
          >
            {authText.switchButton[authState()]}
          </button>
        </p>
      </div>
      {/* oAuth */}
      <div class="mx-auto mt-2 flex max-w-md items-center justify-center gap-4">
        <For each={['GitHub', 'Google']}>
          {(provider) => (
            <button class="flex items-center justify-center rounded-xl bg-black px-4 py-2 transition-all duration-300 hover:bg-gray-800">
              <div class="providerButton">{provider === 'GitHub' ? <GitHub /> : <Google />}</div>
              <div class="mx-3 h-4 border-l border-gray-300"></div>
              <div class="text-white">{provider}</div>
            </button>
          )}
        </For>
      </div>
      {/* Divider */}
      <div class="flex items-center justify-center py-2">
        <div class="w-1/3 border-t border-gray-300"></div>
        <div class="mx-4 text-gray-200">OR</div>
        <div class="w-1/3 border-t border-gray-300"></div>
      </div>
      {/* Email and Password */}
      <div>
        <form class="mx-auto max-w-md" id="auth-form" onSubmit={handleSubmit}>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col">
              <input
                type="email"
                placeholder="Email address"
                class="rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                value={form.email}
                onChange={updateFormField('email')}
              />
            </div>
            <div class="flex flex-col">
              <input
                type="password"
                placeholder="Password"
                class="rounded-lg border border-slate-200 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                value={form.password}
                onChange={updateFormField('password')}
              />
            </div>
            <div class="flex flex-col">
              <button class="rounded-xl bg-indigo-500 px-4 py-2 text-white transition-all duration-300 hover:bg-indigo-600">
                {authText.formButton[authState()]}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
