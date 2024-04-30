<template>
  <div class="local-time">
    Current date: {{ currentDate }}
    Current time: {{ currentTime }}
  </div>
</template>

<script>
export default {
  name: 'LocalTime',

  data() {
    return {
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString()
    };
  },

  mounted() {
    this.updateTimeAndDate();
    this.timer = setInterval(this.updateTimeAndDate, 1000);
  },

  beforeUnmount() {
    clearInterval(this.timer);
  },

  methods: {
    updateTimeAndDate() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString();
      this.currentTime = now.toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.local-time {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0,0,0,0.6);
  background-color: #1abd28;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
}
</style>
