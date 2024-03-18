<template>
  <div id="app">
  <h1>TrainingApp</h1>
    <router-view /> <!-- Ovdje će se dinamički učitavati komponente prema rutama iz main.js -->
  </div>
</template>
<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
