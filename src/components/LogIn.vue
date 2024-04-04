<template>
  <div class="login-container" :class="{ 'dark-mode': darkMode }">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="loginUsername">Username</label>
        <input type="text" class="form-control" id="loginUsername" v-model="loginUsername" required>
      </div>
      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" class="form-control" id="loginPassword" v-model="loginPassword" required>
      </div>
      <div class="button-group">
        <button type="submit" class="btn btn-primary">Login</button>
        <button @click="goToSignUp" class="btn btn-secondary">Sign-up</button>
        <button @click="goBackHome" class="btn btn-secondary">Home</button>
      </div>
    </form>
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginUsername: '',
      loginPassword: '',
      darkMode: false
    };
  },
  methods: {
    login() {
      this.$store.dispatch('loginUser', {
        username: this.loginUsername,
        password: this.loginPassword
      }).then(() => {
        if (this.$store.getters.isLoggedIn) {
          alert('Login successful.');
          this.$router.push({ path: '/' });
        } else {
          alert('Invalid username or password');
        }
      }).catch(error => {
        alert('An error occurred during login. Please try again later.');
        console.error('Login error:', error);
      });
    },
    goToSignUp() {
      this.$router.push({ path: '/sign-up' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }
};
</script>


<style scoped>
/*dark mode */
.dark-mode {
  background-color: #333;
  color: #fff;
}
</style>
