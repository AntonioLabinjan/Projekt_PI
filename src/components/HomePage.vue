<template>
  <div class="container">
    <div class="header">
      <h1>Welcome to Vue Trainer</h1>
<hr>
      <h4>Your personal training application</h4>
      <p>Add your exercises, meals, sleep, water intake, calculate your BMI, and track your progress!</p>
    </div>
    <nav>
      <ul class="navbar">
        <li><button @click="goToImageGallery">Image Gallery</button></li>
      </ul>
    </nav>
    <div class="about-button">
      <button @click="goToAbout">About</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
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
  }
};
</script>

<style scoped>
</style>
