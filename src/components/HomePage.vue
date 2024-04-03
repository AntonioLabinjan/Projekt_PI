<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <div class="login-signup-buttons">
      <button @click="goToLogIn">Log In</button>
      <button @click="goToSignUp">Sign Up</button>
      <button @click="toggleDarkMode">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</button>
    </div>
    <div class="header">
      <h1>Welcome to <span class="highlight">TrainingApp</span></h1>
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
    <div><button @click="goToScanner">Go to Scanner</button></div>
    <div class="motivational-quote">
      <p>{{ motivationalQuote }}</p>
    </div>

    <!-- Display current caloric balance -->
    <div class="caloric-balance">
      <p>Current caloric balance: {{ currentCaloricBalance }}</p>
    </div>

    <notification-maker></notification-maker>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      darkMode: false,
      motivationalQuotes: [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "In the middle of every difficulty lies opportunity. - Albert Einstein",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "The best revenge is massive success. - Frank Sinatra",
  "Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll",
  "The harder I work, the luckier I get. - Samuel Goldwyn",
  "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh (Alice in Wonderland)",
],

      motivationalQuote: ""
    };
  },
  computed: {
    ...mapGetters(['currentCaloricBalance']),
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
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
    goToScanner() {
      this.$router.push({ path: '/qr-scanner'});
    },
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
    },
    selectRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
      this.motivationalQuote = this.motivationalQuotes[randomIndex];
    }
  },
  mounted() {
    this.selectRandomQuote();
  }
};
</script>

<style scoped>
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
  transition: background-color 0.3s ease;
}

.login-signup-buttons button:hover,
.navbar button:hover,
.about-button button:hover,
.caloric-balance button:hover,
.motivational-quote button:hover {
  background-color: #45a049;
}

.header h1 {
  margin-top: 0;
}

.motivational-quote p {
  font-style: italic;
  margin-top: 20px;
}

.caloric-balance p {
  font-weight: bold;
}   
</style>
