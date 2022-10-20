import SuperTokens from 'supertokens-web-js';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import { SuperTokensWebJSConfig } from './config';
import router from './router';

SuperTokens.init(SuperTokensWebJSConfig);

const app = createApp(App);

app.use(router);

app.mount('#app');
