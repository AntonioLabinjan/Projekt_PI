<template>
    <h2>About Vue Trainer</h2>
    <hr>
    </div>
    <button @click="goToExerciseSuggestions">Go to Exercise suggestions</button>
    <button @click="goToMealSuggestions">Go to Meal suggestions</button>
    <hr>
    </div>
    <button @click="goBackHome">Go Back Home</button>
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
