/* eslint-disable */
<template>
  <div>
    <div :class="{'dark-mode': isDark}" class="dark-mode-toggle-container">
      <ToggleSwitch v-model="isDark" />
    </div>
    <div class="loading-pulse" v-if="isLoading">
      <div class="pulse"></div>
    </div>
    <local-time></local-time>
    <vue-header></vue-header>
    <router-view></router-view>
  </div>
</template>

<script>
import ToggleSwitch from '@/components/DarkModeButton.vue';
export default {
  name: 'App',
  components: {
    ToggleSwitch
  },
  data() {
    return {
      isLoading: false,
      isDark: false
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.isLoading = true;
      next();
    });

    this.$router.afterEach(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    });
  },
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
  background: linear-gradient(to right, #0facaf, #0d9561);
  min-height: 100vh; 
}

.dark-mode-toggle-container {
  text-align: left; 
  padding-left: 10px; 
}

.loading-pulse {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.pulse {
  width: 100px;
  height: 100px;
  background-color: #3498db;
  border-radius: 50%;
  animation: pulseAnimation 1s infinite ease-in-out;
}

@keyframes pulseAnimation {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(0.8);
    opacity: 1;
  }
}

.dark-mode {
  background-color: black;
  color: white; 
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
  
  background-color: #4CAF50; 
  color: white;
}

button:hover {
  background-color: #45a049; 
}


@media (min-width: 601px) {
  .dark-mode-toggle-container {
    text-align: left; 
    padding-left: 10px; 
  }

  .loading-pulse {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .pulse {
    width: 100px;
    height: 100px;
  }

  button {
    font-size: 16px;
    padding: 10px 20px;
  }
}

/* Styles for mobile */
@media (max-width: 600px) {
  #app {
    margin-top: 20px;
  }

  .dark-mode-toggle-container {
    text-align: center; 
    padding-left: 0; 
  }

  .pulse {
    width: 50px;
    height: 50px;
  }

  button {
    font-size: 14px;
    padding: 6px 12px;
  }
}
</style>
