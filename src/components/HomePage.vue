<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <div class="login-signup-buttons">
      <button @click="goToLogIn">Log In</button>
      <button @click="goToSignUp">Sign Up</button>
      <button @click="toggleDarkMode">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</button>
      <button @click="viewUsers">View users</button>
    </div>
    <div class="header">
      <h1>Welcome to <span class="highlight">TrainingMate 2.0</span></h1>
      <hr>
      <h4>Your personal training application</h4>
      <p>Add your exercises, meals, sleep, water intake, calculate your BMI, and track your progress!</p>
    </div>
    <nav>
      <ul class="navbar">
        <li><button @click="goToImageGallery">Image Gallery</button></li>
        <li><button @click="goToVueTrainer">Training App</button></li>
        <li><button @click="goToMealTracker">Meal Tracker</button></li>
        <li><button @click="goToSleepTracker">Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake">Water Intake Tracker</button></li>
        <li><button @click="goToBMI">BMI Calculator</button></li>
        <li><button @click="goToStreak">Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer">Music Player</button></li>
      </ul>
    </nav>
    <div class="about-button">
      <button @click="goToAbout">About</button>
    </div>
    <div><button @click = "goToQR"> Go to QR codes</button></div>
    <div><button @click="goToScanner">Go to Scanner</button></div>
    <div>
    <motivationalQuote></motivationalQuote>
    </div>
      <hr>
    </div>
    <img src="@/assets/OIP.jpg" alt="Motivational Image" class="motivational-image"  @click="playLionRoar">
    <div class="caloric-balance" v-if="currentUser">
  <p>Total calories consumed: {{ totalCaloriesConsumed }}</p>
  <p>Total calories burned: {{ totalCaloriesBurned }}</p>
  <p>Caloric balance: {{ caloricBalance }}</p>
  <p>Status: {{ balanceStatus }}</p>
</div>

    <hr>
    <notification-maker></notification-maker>
    <user-bar></user-bar>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '@/firebase';

export default {
  data() {
    return {
      darkMode: false,
      totalCaloriesConsumed: 0,
      totalCaloriesBurned: 0,
      currentUser: null,
    };
  },
  computed: {
    caloricBalance() {
      return this.totalCaloriesConsumed - this.totalCaloriesBurned;
    },
    balanceStatus() {
    if (this.caloricBalance > 0) {
      return "Surplus";
    } else if (this.caloricBalance < 0) {
      return "Deficit";
    } else {
      return "Balanced";
    }
  },
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        window.alert("Uspješno ste se odlogirali.");
        this.$router.push('/');
      } catch (error) {
        console.error('Greška prilikom odlogiranja:', error);
        window.alert("Došlo je do pogreške prilikom odlogiranja.");
      }
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
    },
    async fetchMeals() {
  if (!this.currentUser) return;
  const mealsRef = collection(db, `users/${this.currentUser.uid}/meals`);
  try {
    const mealsSnapshot = await getDocs(mealsRef);
    this.totalCaloriesConsumed = 0;
    mealsSnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      this.totalCaloriesConsumed += doc.data().calories;
    });
    console.log('Total Calories Consumed:', this.totalCaloriesConsumed);
  } catch (error) {
    console.error('Error fetching meals:', error);
  }
},

async fetchExercises() {
  if (!this.currentUser) return;
  const exercisesRef = collection(db, `users/${this.currentUser.uid}/exercises`);
  try {
    const exercisesSnapshot = await getDocs(exercisesRef);
    this.totalCaloriesBurned = 0;
    exercisesSnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      this.totalCaloriesBurned += doc.data().calories;
    });
    console.log('Total Calories Burned:', this.totalCaloriesBurned);
  } catch (error) {
    console.error('Error fetching exercises:', error);
  }
},

    playLionRoar() {
      const roarSound = new Audio(require('@/assets/roar.mp3')); 
      roarSound.play().catch((error) => {
        console.error("Failed to play the audio:", error);
      });
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToVueTrainer() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToLogIn() {
      this.$router.push({ path: '/login' });
    },
    goToSignUp() {
      this.$router.push({ path: '/sign-up' });
    },
    goToSleepTracker() {
      this.$router.push({ path: '/sleep-tracker' });
    },
    goToWaterIntake() {
      this.$router.push({ path: '/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator' });
    },
    goToAbout() {
      this.$router.push({ path: '/about' });
    },
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
    goToQR(){
      this.$router.push({path: '/qr-codes-default' });
    },
    goToScanner() {
      this.$router.push({ path: '/qr-scanner'});
    },
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
    },
    viewUsers(){
      this.$router.push({path: '/admin-login', query: { redirect:'/user-panel'}});
    }
  },
  /*
  mounted() {
    this.fetchExercises();
    this.fetchMeals();
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  },*/
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.fetchExercises();
        this.fetchMeals();
      } else {
        this.currentUser = null;
        this.totalCaloriesConsumed = 0;
        this.totalCaloriesBurned = 0;
      }
    });
  },
};
</script>

<style scoped>
h1 {
    font-size: 5rem;
    text-shadow: 5px 5px 0px green;
}

.container {
  position: relative; 
}

.container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #aeed0e, #03cb1b);
  opacity: 0.3; 
  pointer-events: none; 
}

.container.dark-mode {
  background-color: #262626;
  color: #fff;
}

.container {
  background-color: #f4f4f4;
}

.highlight {
  color: #4CAF50;
}

.login-signup-buttons button,
.navbar button,
.about-button button,
.caloric-balance button,
.motivational-quote button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease; 
}

.login-signup-buttons button:hover,
.navbar button:hover,
.about-button button:hover,
.caloric-balance button:hover,
.motivational-quote button:hover {
  background-color: #45a049;
  transform: scale(1.05); 
}

.header {
  position: relative; 
  z-index: 1; 
}

.header h1 {
  margin-top: 0;
  font-size: 2.5em; 
  text-transform: uppercase; 
}

.header h4 {
  font-size: 1.2em; 
}

.motivational-quote {
  position: relative; 
  z-index: 1; 
}

.motivational-quote p {
  font-style: italic;
  margin-top: 20px;
}

.motivational-quote button {
  font-weight: bold; 
  border: 2px solid #4CAF50; 
}

.motivational-quote button:hover {
  background-color: #4CAF50; 
}

.caloric-balance p {
  font-weight: bold;
}   

.motivational-image {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 
              0 6px 20px rgba(0, 0, 0, 0.1);
  filter: brightness(10%) contrast(150%);
  transition: filter 0.3s ease-in-out;
}

.motivational-image:hover {
  filter: brightness(100%) contrast(100%);
}

.user-info {
  margin-top: 20px;
  text-align: center;
}
</style>
