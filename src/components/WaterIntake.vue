<template>
  <h1>Unos vode</h1> 
</template>

<script>
export default {
  name: 'EmptyComponent',
  methods: {
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
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator'});
    },
    goToStreak() {
      this.$router.push({path: '/streak'});
    }
  } 
}
</script>

<style scoped>
.empty-component {
  /* Stilovi za praznu komponentu */
}
</style>
