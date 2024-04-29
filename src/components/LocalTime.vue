<template>
    <div class="local-time">
      Trenutno vrijeme: {{ currentTime }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'LocalTime',
  
    data() {
      return {
        currentTime: new Date().toLocaleTimeString()
      };
    },
  
    mounted() {
      this.timer = setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString();
      }, 1000);
    },
  
    beforeUnmount() {
      clearInterval(this.timer);
    }
  };
  </script>
  
  <style scoped>
  .local-time {
    font-size: 24px;
    font-weight: bold;
  }
  </style>
  
