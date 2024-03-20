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
    <div class="motivational-quote">
      <p>{{ motivationalQuote }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // dodat ih baren još 20
      motivationalQuotes: [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Everything you’ve ever wanted is on the other side of fear. - George Addair",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
  "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
  "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
  "It always seems impossible until it’s done. - Nelson Mandela",
  "Your limitation—it’s only your imagination. - Unknown",
  "Push yourself, because no one else is going to do it for you. - Unknown",
  "Great things never come from comfort zones. - Unknown",
  "Dream it. Wish it. Do it. - Unknown",
  "Success doesn’t just find you. You have to go out and get it. - Unknown",
  // Dodajte ovdje još citata...
]

      motivationalQuote: ""
    };
  },
  methods: {
    selectRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
      this.motivationalQuote = this.motivationalQuotes[randomIndex];
    },
    // Metode za rutiranje na druge stranice
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
  },
  mounted() {
    this.selectRandomQuote();
  }
};
</script>

<style scoped>
</style>
