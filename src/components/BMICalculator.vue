<template>
  <!-- ove css klase imenujem unaprijed s ciljem da se sve slične klase isto zovu, pa da mi CSS bude koliko-toliko konzistentan -->
    <h1>BMI Calculator</h1>
	<nav>
      <ul class="navbar-nav">
        <li class="nav-item"><button @click="goToVueTrainer" class="btn btn-secondary">Go to Training app</button></li>
        <li class="nav-item"><button @click="goToImageGallery" class="btn btn-secondary">Go to Image Gallery</button></li>
        <li class="nav-item"><button @click="goToSleepTracker" class="btn btn-secondary">Go to Sleep Tracker</button></li>
        <li class="nav-item"><button @click="goToMealTracker" class="btn btn-secondary">Go to Meal Tracker</button></li>
        <li class="nav-item"><button @click="goToWaterIntake" class="btn btn-secondary">Go to Water Intake Tracker</button></li>
	<li class="nav-item"><button @click="goToStreak" class="btn btn-secondary">Go to Streak Tracker</button></li>
        <li class="nav-item"><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul>
    </nav>
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
    goBackHome() {
      this.$router.push({ path: '/' });
    },
	goToStreak() {
      this.$router.push({ path: '/streak' });
    },
  }
};
</script>

<style scoped>
</style>
