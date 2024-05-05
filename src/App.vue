<template>
  <div>
    <div class="loading-pulse" v-if="isLoading">
      <div class="pulse"></div>
    </div>
    <local-time></local-time>
    <vue-header></vue-header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoading: false,
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
</style>
