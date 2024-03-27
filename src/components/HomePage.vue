<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <div class="login-signup-buttons">
      <button @click="goToLogIn">Log In</button>
      <button @click="goToSignUp">Sign Up</button>
      <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    </div>
    <div class="header">
      <h1>Welcome to TrainingAPP</h1>
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
      </ul>
    </nav>
    <div class="about-button">
      <button @click="goToAbout">About</button>
    </div>
    <div><button @click="goToScanner">Go to scanner</button></div>
    <div class="motivational-quote">
      <p>{{ motivationalQuote }}</p>
    </div>

    <!-- Ugradnja notificationMaker.vue komponente -->
    <notification-maker></notification-maker>
  </div>
</template>

<script>
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
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
      ],
      motivationalQuote: ""
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
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
  background-color: #000;
  color: #fff;
}

.login-signup-buttons button,
.navbar button,
.about-button button {
  background-color: red;
  color: black;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.login-signup-buttons button:hover,
.navbar button:hover,
.about-button button:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.header h1 {
  margin-top: 0;
}

.motivational-quote p {
  font-style: italic;
  margin-top: 20px;
}
</style>
