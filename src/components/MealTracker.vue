<template>
  <div>
    <h1>Meal Tracker</h1>
    <div>
      <nav class="navbar">
        <ul class="navbar-nav">
          <li><button @click="goToVueTrainer" class="btn-secondary">Go to Training app</button></li>
          <li><button @click="goToImageGallery" class="btn-secondary">Go to Image Gallery</button></li>
          <li><button @click="goToSleepTracker" class="btn-secondary">Go to Sleep Tracker</button></li>
          <li><button @click="goToWaterIntakeTracker" class="btn-secondary">Go to Water Intake Tracker</button></li>
          <li><button @click="goToBMI" class="btn-secondary">Go to BMI Calculator</button></li>
          <li><button @click="goToStreak" class="btn-secondary">Go to Streak Tracker</button></li>
          <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
        </ul>
      </nav>
    </div>
    <hr>
  </div>
</template>

<script>
export default {
   
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToVueTrainer() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToSleepTracker() {
      this.$router.push({ path: '/sleep-tracker' });
    },
    goToWaterIntakeTracker() {
      this.$router.push({ path: '/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator' });
    },
    goToStreak() {
      this.$router.push({path: '/streak'});
    },
  },
};
</script>

<style scoped>

</style>
