import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store/store.js';
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
import QrScanner from './components/QrScanner.vue';
import notificationMaker from './components/notificationMaker.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
let isUserLoggedIn = false;

const auth = getAuth();  

onAuthStateChanged(auth, (user) => {
  isUserLoggedIn = !!user;  
});

function isLoggedIn() {
  return isUserLoggedIn;
}

const routes = [
  { path: '/', component: HomePage },
  { path: '/image-gallery', component: ImageGallery, meta: { requiresAuth: true } },
  { path: '/vue-trainer', component: VueTrainer, meta: { requiresAuth: true } },
  { path: '/sign-up', component: SignUp },
  { path: '/login', component: LogIn },
  { path: '/meal-tracker', component: MealTracker, meta: { requiresAuth: true } },
  { path: '/sleep-tracker', component: SleepTracker, meta: { requiresAuth: true } },
  { path: '/water-intake', component: WaterIntake, meta: { requiresAuth: true } },
  { path: '/BMI-calculator', component: BMICalculator, meta: { requiresAuth: true } },
  { path: '/about', component: AboutPage },
  { path: '/streak', component: StreakCheck, meta: { requiresAuth: true } },
  { path: '/default-exercises', component: DefaultExercises },
  { path: '/default-meals', component: DefaultMeals },
  { path: '/qr-scanner', component: QrScanner, meta: { requiresAuth: true } },
  { path: '/notification-maker', component: notificationMaker },
  { path: '/music', component: MusicPlayer, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isRequiresAuth = to.meta.requiresAuth;
  
  if (isRequiresAuth && !isLoggedIn()) {
    next('/login');  // Ako nismo ulogirani, šalje nas na login
  } else if (!isRequiresAuth && isLoggedIn() && to.path === '/login') {
    window.alert("već ste ulogirani, ne možete opet") // ne pusti nas da se opet ulogiramo ako smo ulogirani i šalje nas na homepage
    next('/');  
  } else {
    next();  // ako smo ulogirani i klikćemo na neku rutu koja ni login, onda je okej i šalje nas na traženu rutu
  }
});

const app = createApp(App);
// Registracija komponenti
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
app.component('QrScanner', QrScanner);
app.component('notificationMaker', notificationMaker);
app.component('MusicPlayer', MusicPlayer);
app.use(router);
app.use(store);

app.mount('#app');
