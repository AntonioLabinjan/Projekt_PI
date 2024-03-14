// konfiguracija rutera i komponenti
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ImageGallery from './components/ImageGallery.vue';
import VueTrainer from './components/VueTrainer.vue';
import HomePage from './components/HomePage.vue';
import LogIn from './components/LogIn.vue';
import SignUp from './components/SignUp.vue';
import MealTracker from './components/MealTracker.vue';
import SleepTracker from './components/SleepTracker.vue';
import WaterIntake from './components/WaterIntake.vue';
import BMICalculator from './components/BMICalculator.vue';
import AboutPage from './components/AboutPage.vue';
import DefaultExercises from './components/DefaultExercises.vue';
import DefaultMeals from './components/DefaultMeals.vue';
import StreakCheck from './components/StreakCheck.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/image-gallery', component: () => import('./components/ImageGallery.vue') },
  { path: '/vue-trainer', component: () => import('./components/VueTrainer.vue') }, 
  { path: '/sign-up', component: () => import('./components/SignUp.vue') },
  { path: '/login', component: () => import('./components/LogIn.vue') }, 
  { path: '/meal-tracker', component: () => import('./components/MealTracker.vue') },
  { path: '/sleep-tracker', component: () => import('./components/SleepTracker.vue') },
  { path: '/water-intake', component: () => import('./components/WaterIntake.vue') },
  { path: '/BMI-calculator', component: () => import('./components/BMICalculator.vue') },
  { path: '/about', component: () => import('./components/AboutPage.vue') },
  {path: '/streak', component: () => import('./components/StreakCheck.vue') },
  {path: '/default-exercises', component: () => import('./components/DefaultExercises.vue') },
  {path: '/default-meals', component: () => import('./components/DefaultMeals.vue') },
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.component('ImageGallery', ImageGallery);
app.component('VueTrainer', VueTrainer);
app.component('HomePage', HomePage);
app.component('SignUp', SignUp);
app.component('LogIn', LogIn);
app.component('MealTracker', MealTracker);
app.component('SleepTracker', SleepTracker);
app.component('WaterIntake', WaterIntake);
app.component('BMICalculator', BMICalculator);
app.component('AboutPage', AboutPage);
app.component('DefaultExercises', DefaultExercises);
app.component('DefaultMeals', DefaultMeals);
app.component('StreakCheck', StreakCheck);
app.use(router);
app.mount('#app');
