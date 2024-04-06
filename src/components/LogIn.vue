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
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-group {
  text-align: center;
}

.btn {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-dark {
  margin-top: 10px;
  display: block;
  width: 100%;
  background-color: #333;
  color: #fff;
}

.btn-dark:hover {
  background-color: #555;
}

.login-container.dark-mode {
  background-color: #000;
  color: #fff;
}
</style>
