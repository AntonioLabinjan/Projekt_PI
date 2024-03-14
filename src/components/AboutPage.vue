<template>
    <h2>About Vue Trainer</h2>
    <hr>
</template>

<script>
export default {
  name: 'AboutPage',
  methods: {
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToExerciseSuggestions() {
      this.$router.push({ path: '/default-exercises' });
    },
    goToMealSuggestions() {
      this.$router.push({ path: '/default-meals' });
    },
  }
};
</script>

</style>
