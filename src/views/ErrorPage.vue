/* eslint-disable */
<template>
  <div>
    <hr>
    <h1>You are not allowed to see this page without login</h1>
    <hr>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style scoped>
button {
  background: linear-gradient(145deg, #7a7a7a, #9d9d9d);
  color: #fff;
  border: 1px solid #8b8b8b;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background: linear-gradient(145deg, #929292, #b5b5b5);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5), 
              -2px -2px 10px rgba(255, 255, 255, 0.4);
}

button:active {
  background: linear-gradient(145deg, #5b5b5b, #7e7e7e);
  transform: scale(0.98);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2), 
              -1px -1px 5px rgba(255, 255, 255, 0.1);
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
