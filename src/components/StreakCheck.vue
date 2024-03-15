  <template>
  <div class="workout-tracker">
    <!-- Navigacija -->
    <nav class="navbar">
      <ul>
        <!-- Ostale opcije navigacije -->
        <li><button @click="goToImageGallery">Go to Image Gallery</button></li>
        <li><button @click="goToVueTrainer">Go to Training App</button></li>
        <li><button @click="goToMealTracker">Go to Meal Tracker</button></li>
        <li><button @click="goToSleepTracker">Go to Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goBackHome">Go Back Home</button></li>
      </ul>
    </nav>

<script>
export default {
  data() {
  },
  methods: {
    // Funkcije za navigaciju
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToVueTrainer() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
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
    // Funkcija za povratak na početnu rutu
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    
};
};
</script>

<style scoped>

</style>
