<template>
  <div>
    <h1>Sleep Tracker</h1>
  </div>  
</template>

<script>
export default {
  data() {
    },
  },
  methods: {
    
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToTrainingApp() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToWaterIntake() {
      this.$router.push({ path: '/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator' });
    },
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
  },
};
</script>

<style scoped>

</style>
