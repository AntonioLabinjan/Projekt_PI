// konfiguracija rutera i komponenti
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
const routes = [
  { path: '/', component: HomePage },  ];


const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.component('HomePage', HomePage);
app.use(router);
app.mount('#app');
