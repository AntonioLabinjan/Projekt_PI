/* eslint-disable */
<template>
  <div class="login-container" :class="{ 'dark-mode': darkMode }">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="loginEmail">Email</label>
        <input type="email" class="form-control" id="loginEmail" v-model="loginEmail" required>
      </div>
      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" class="form-control" id="loginPassword" v-model="loginPassword" required>
      </div>
      <div class="button-group">
        <button type="submit" class="btn metallic-button">Login</button>
        <button @click="goToSignUp" class="btn metallic-button">Sign-up</button>
        <button @click="goBackHome" class="btn metallic-button">Home</button>
      </div>
    </form>
    <button @click="toggleDarkMode" class="btn metallic-button">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

export default {
  data() {
    return {
      loginEmail: '',
      loginPassword: '',
      darkMode: false
    };
  },
  methods: {
    login() {
      signInWithEmailAndPassword(auth, this.loginEmail, this.loginPassword)
        .then(() => {
          alert('Login successful.');
          this.$router.replace({ path: '/' });
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              alert('Invalid email or password');
              break;
            default:
              alert('An error occurred during login. Please try again later.');
              break;
          }
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


.metallic-button {
  background: linear-gradient(to bottom, #8c8c8c, #333);
  border: 1px solid #666;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  transition: 0.3s;
}

.metallic-button:hover {
  background: linear-gradient(to bottom, #333, #8c8c8c);
  border: 1px solid #999;
  transition: 0.3s;
}
</style>
