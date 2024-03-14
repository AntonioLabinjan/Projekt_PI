  
<template>
   <!-- Ovdje ćemo moći dodavati dane kada smo trenirali, pratit će se streak dana, kad postignemo određeni streak, dobit ćemo neku "nagradu" (najvjerojatnije ću ubaciti neku grafičku ikonicu koja će nam se prikazati, ili tako nešto) -->
</template>

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
