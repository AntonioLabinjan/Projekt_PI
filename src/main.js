import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store/store.js';
import ImageGallery from './views/ImageGallery.vue';
import VueTrainer from './views/VueTrainer.vue';
import HomePage from './views/HomePage.vue';
import LogIn from './views/LogIn.vue';
import SignUp from './views/SignUp.vue';
import MealTracker from './views/MealTracker.vue';
import SleepTracker from './views/SleepTracker.vue';
import WaterIntake from './views/WaterIntake.vue';
import BMICalculator from './views/BMICalculator.vue';
import AboutPage from './views/AboutPage.vue';
import DefaultExercises from './views/DefaultExercises.vue';
import DefaultExercisesNotAdmin from './views/DefaultExercisesNotAdmin.vue';
import DefaultMealsNotAdmin from './views/DefaultMealsNotAdmin.vue';
import DefaultMeals from './views/DefaultMeals.vue';
import StreakCheck from './views/StreakCheck.vue';
import QrScanner from './views/QrScanner.vue';
import notificationMaker from './components/notificationMaker.vue';
import UserBar from './components/UserBar.vue';
import MusicPlayer from './views/MusicPlayer.vue';
import ErrorPage from './views/ErrorPage.vue';
import AdminLogin from './views/AdminLogin.vue';
import LocalTime from './components/LocalTime.vue';
import MotivationalQuote from './components/MotivationalQuote.vue';
import QrCodesDefault from './views/QRCodesDefault.vue';
import QrCodesAdmin from './views/QRCodesAdmin.vue';
import UserPanel from './views/UserPanel.vue';
import VueHeader from './components/VueHeader.vue';
import TesterComponent from './views/TesterComponent.vue';
import DarkModeButton from './components/DarkModeButton.vue';
import MapFrame from './components/MapFrame.vue';
import SportEvents from './views/SportEvents.vue';
import SportEventsAdmin from './views/SportEventsAdmin.vue';
import EventMap from './components/EventMap.vue';
import ChatComponent from './views/ChatComponent.vue';
import IntervalTimer from './components/IntervalTimer.vue';
import MemoryGame from './components/MemoryGame.vue';


import firebase from 'firebase/app';
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

function requiresAdmin(to, from, next) {
  const currentUser = getAuth().currentUser;

  if (currentUser) {
    firebase.firestore().collection('users').doc(currentUser.uid).get()
      .then(doc => {
        if (doc.exists && doc.data().isAdmin) {
          next();
        } else {
          next({ path: '/error' }); // tu bin moga napravit custom not admin error komponentu
        }
      })
      .catch(error => {
        console.error("Error getting user document:", error);
        next({ path: '/error' }); 
      });
  } else {
    next({ path: '/' }); 
  }
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
  { path: '/default-exercises', component: DefaultExercises  }, 
  { path: '/default-meals', component: DefaultMeals }, 
  { path: '/NA-exercises', component: DefaultExercisesNotAdmin},
  { path: '/NA-meals', component: DefaultMealsNotAdmin},
  { path: '/qr-scanner', component: QrScanner, meta: { requiresAuth: true } },
  { path: '/notification-maker', component: notificationMaker },
  { path: '/music', component: MusicPlayer, meta: { requiresAuth: true } },
  { path: '/error', component: ErrorPage},
  { path: '/admin-login', component: AdminLogin},
  { path: '/qr-codes-default', component: QrCodesDefault},
  { path: '/qr-codes-admin', component: QrCodesAdmin },
  { path: '/user-panel', component: UserPanel },
  { path: '/test-test', component: TesterComponent},
  { path: '/map', component: MapFrame},
  { path: '/sport-events', component: SportEvents},
  { path: '/admin-events', component: SportEventsAdmin},
  { path: '/chat', component: ChatComponent, meta: { requiresAuth: true }},
  {path: '/interval', component: IntervalTimer},
  { path: '/memory', component: MemoryGame}

];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isRequiresAuth = to.meta.requiresAuth;
  const isRequiresAdmin = to.meta.requiresAdmin;

  if (isRequiresAuth && !isLoggedIn()) {
    next('/error');
  } else if (isRequiresAdmin && !requiresAdmin(to, from, next)) {
    next('/');
  } else if (!isRequiresAuth && isLoggedIn() && to.path === '/login') {
    alert("You are already logged in");
    next('/');
  } else {
    next();
  }
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
app.component('QrScanner', QrScanner);
app.component('notificationMaker', notificationMaker);
app.component('MusicPlayer', MusicPlayer);
app.component('UserBar', UserBar);
app.component('DefaultExercisesNotAdmin', DefaultExercisesNotAdmin);
app.component('DefaultMealsNotAdmin', DefaultMealsNotAdmin);
app.component('ErrorPage', ErrorPage);
app.component('AdminLogin', AdminLogin);
app.component('LocalTime', LocalTime);
app.component('MotivationalQuote', MotivationalQuote);
app.component('QrCodesDefault', QrCodesDefault);
app.component('QrCodesAdmin', QrCodesAdmin);
app.component('UserPanel', UserPanel);
app.component('VueHeader', VueHeader);
app.component('TesterComponent', TesterComponent);
app.component('DarkModeButton', DarkModeButton);
app.component('MapFrame', MapFrame);
app.component('SportEvents', SportEvents);
app.component('EventMap', EventMap);
app.component('SportEventsAdmin', SportEventsAdmin);
app.component('ChatComponent', ChatComponent);
app.component('IntervalTimer', IntervalTimer);
app.component('MemoryGame', MemoryGame);
app.use(router);
app.use(store);

app.mount('#app');
