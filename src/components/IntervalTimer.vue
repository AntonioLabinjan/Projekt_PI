<template>
    <div class="interval-timer">
      <div class="timer-card" v-if="timerRunning">
        <h2 v-if="currentInterval === 'interval'">Interval {{ currentIntervalIndex + 1 }}</h2>
        <h2 v-else>Pause</h2>
        <h3>{{ displayTime }}</h3>
      </div>
  
      <div class="form" v-else>
        <h1>Interval timer</h1>
        <label for="numIntervals">Number of intervals:</label>
        <input type="number" id="numIntervals" v-model="numIntervals">
  
        <label for="intervalDuration">Interval duration(s):</label>
        <input type="number" id="intervalDuration" v-model="intervalDuration">
  
        <label for="breakDuration">Pause duration(s):</label>
        <input type="number" id="breakDuration" v-model="breakDuration">
  
        <button @click="startTimer" :disabled="timerRunning">Start the timer</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        numIntervals: 0,
        intervalDuration: 0,
        breakDuration: 0,
        timerRunning: false,
        currentIntervalIndex: 0,
        currentInterval: 'interval', // 'interval' ili 'break'
        timeRemaining: 0,
        timerInterval: null,
      };
    },
    computed: {
      displayTime() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      },
    },
    methods: {
      startTimer() {
        this.currentIntervalIndex = 0;
        this.currentInterval = 'interval';
        this.timeRemaining = this.intervalDuration;
        this.timerRunning = true;
        this.timerInterval = setInterval(this.tick, 1000);
      },
      tick() {
        this.timeRemaining--;
        if (this.timeRemaining === 0) {
          if (this.currentInterval === 'interval') {
            this.currentIntervalIndex++;
            if (this.currentIntervalIndex < this.numIntervals) {
              this.currentInterval = 'break';
              this.timeRemaining = this.breakDuration;
            } else {
              this.timerRunning = false;
              alert("Time's up!!!!")
              clearInterval(this.timerInterval);
            }
          } else {
            this.currentInterval = 'interval';
            this.timeRemaining = this.intervalDuration;
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .interval-timer {
    display: flex;
    justify-content: center;
    align-items: flex-start; 
    height: 100vh;
  }
  
  .timer-card {
    background-color: #f7f7f7;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px; 
  }
  
  .form {
    background-color: #0a9824;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  h2 {
    margin-bottom: 5px;
  }
  
  h3 {
    font-size: 24px;
    font-weight: bold;
  }
  </style>
  
