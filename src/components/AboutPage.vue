<template>
    <h2>About Vue Trainer</h2>
    <hr>
    </div>
    <button @click="goToExerciseSuggestions">Go to Exercise suggestions</button>
    <button @click="goToMealSuggestions">Go to Meal suggestions</button>
    <hr>
    </div>
    <div class="author-info">
      <h3 class="feature-title" style="color: blue;">About the Author</h3>
      <p><b>Name:</b> Antonio Labinjan</p>
      <p><b>Occupation:</b> 2nd-year student of Computer Science at the Faculty of Informatics in Pula</p>
      <p><b>Mentor:</b> Nikola Tanković</p>
      <p><b>Course:</b> Software Engineering</p>
      <p><b>Academic Year:</b> 2023/24</p>
      <p><b>GitHub:</b> <a href="https://github.com/AntonioLabinjan" target="_blank">github.com/AntonioLabinjan</a></p>
      <p><b>Contact:</b></p>
      <p>   <b> Personal email:</b> alabinjan6@gmail.com</p>
      <p>   <b> Official email:</b> alabinjan@unipu.hr</p>
      <p>   <b> Phone:</b> 0919135146</p>
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
