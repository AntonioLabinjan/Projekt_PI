<template>
  <div id="app">
    <h1>Galerija Vježbi</h1>
    <hr>
    <div v-for="(exercise, index) in exercises" :key="index" class="exercise">
      <h2>{{ exercise.name }}</h2>
      <p><strong>Broj ponavljanja:</strong> {{ exercise.reps }}</p>
      <p><strong>Broj setova:</strong> {{ exercise.sets }}</p>
      <p><strong>Trajanje:</strong> {{ exercise.duration }}</p>
      <p><strong>Dio tijela:</strong> {{ exercise.bodyPart }}</p>
      <p><strong>Upute:</strong> {{ exercise.instructions }}</p>
      <img :src="exercise.image" alt="Demonstracija vježbe">
      <hr>
    </div>
    <!-- Button to go back to the about page -->
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
     exercises: [
  { name: 'Čučnjevi', reps: 12, sets: 3, duration: '1 minuta', bodyPart: 'Noge', instructions: 'Stanite uspravno, spustite se kao da sjedite na stolicu, zatim se vratite u početni položaj.', image: 'https://th.bing.com/th/id/R.7501f29ab92bb18f2fba9c4311a453ca?rik=74830ZTxqOoXYQ&pid=ImgRaw&r=0' },
  { name: 'Sklekovi', reps: 15, sets: 4, duration: '30 sekundi', bodyPart: 'Prsa', instructions: 'Postavite ruke na tlo malo šire od širine ramena, spustite se prema dolje savijajući laktove, a zatim se vratite u početni položaj.', image: 'https://th.bing.com/th/id/OIP.zpJ5qP9dxrz4GiOlUTIR6wHaFj?rs=1&pid=ImgDetMain' },
],
  methods: {
    goBack() {
      this.$router.push({ path: '/about' });
    },
  }
};
</script>

<style scoped>
</style>
