<template>
  <div class="container">
    <div class="login-signup-buttons">
      <button @click="goToLogIn">Log In</button>
      <button @click="goToSignUp">Sign Up</button>
    </div>
    <div class="header">
      <h1>Welcome to Vue Trainer</h1>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    selectRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
      this.motivationalQuote = this.motivationalQuotes[randomIndex];
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
    }
  },
  mounted() {
    this.selectRandomQuote();
  }
};
</script>

<style scoped>

.login-signup-buttons button,
.navbar button,
.about-button button {
  background-color: red; /* Transparentni bijeli */
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
  background-color: rgba(255, 255, 255, 0.5); /* Polu-prozirni bijeli */
}

.header h1 {
  margin-top: 0;
}

.motivational-quote p {
  font-style: italic;
  margin-top: 20px;
}
</style>
