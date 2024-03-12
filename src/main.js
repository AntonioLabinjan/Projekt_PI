// konfiguracija rutera i komponenti
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import ImageGallery from './components/ImageGallery.vue';
const routes = [
  { path: '/', component: HomePage },
  { path: '/image-gallery', component: ImageGallery },  
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.component('HomePage', HomePage);
app.component('ImageGallery', ImageGallery);
app.use(router);
app.mount('#app');
