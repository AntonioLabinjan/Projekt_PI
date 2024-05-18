/* eslint-disable */
<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h2>Sign Up</h2>
    <hr>
    <form @submit.prevent="signUp" class="signup-form">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" class="form-control" id="firstName" v-model="firstName" required>
      </div>
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" class="form-control" id="lastName" v-model="lastName" required>
      </div>
      <div class="form-group">
        <label for="signupEmail">E-mail</label>
        <input type="email" class="form-control" id="signupEmail" v-model="signupEmail" required>
      </div>
      <div class="form-group">
        <label for="signupPassword">Password</label>
        <input type="password" class="form-control" id="signupPassword" v-model="signupPassword" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <div class="button-group">
        <button type="submit" class="metallic-button">Sign Up</button>
        <button @click="goToLogIn" class="metallic-button">Login</button>
        <button @click="goBackHome" class="metallic-button">Home</button>
        <br>
        <button @click="toggleDarkMode" class="metallic-button">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth } from '@/firebase';

const db = getFirestore();

export default {
  data() {
    return {
      darkMode: false,
      firstName: '',
      lastName: '',
      signupEmail: '',
      signupPassword: '',
      confirmPassword: ''
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    async signUp() {
      if (this.signupPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }
      if (!/\d/.test(this.signupPassword)) {
        alert("Password must contain at least one digit.");
        return;
      }
      if (!/[A-Z]/.test(this.signupPassword)) {
        alert("Password must contain at least one uppercase letter.");
        return;
      }
      if (this.signupPassword !== this.confirmPassword) {
        alert("Passwords don't match. Please enter matching passwords.");
        return;
      }
      if (!this.validateEmail(this.signupEmail)) {
        alert("Please enter a valid email address.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.signupEmail, this.signupPassword);
        await sendEmailVerification(auth.currentUser);

        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          username: `${this.firstName} ${this.lastName}`,
          email: this.signupEmail
        });

        alert('Registration successful. Please verify your email. You can now login.');
        this.$router.push({ path: '/login' });
      } catch (error) {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('Invalid email address.');
            break;
          case 'auth/weak-password':
            alert('Password is too weak.');
            break;
          case 'auth/email-already-in-use':
            alert('Email is already in use.');
            break;
          default:
            alert('An error occurred during registration. Please try again later.');
            break;
        }
        console.error('Registration error:', error);
      }
    },
    goToLogIn() {
      this.$router.push({ path: '/login' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
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

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-group {
  text-align: center;
}

.metallic-button {
  background: linear-gradient(145deg, #d4d4d4, #ffffff);
  border: 1px solid #ccc;
  color: #000;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s, box-shadow 0.3s;
  cursor: pointer;
  margin: 5px;
}

.metallic-button:hover {
  background: linear-gradient(145deg, #ffffff, #d4d4d4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode {
  background-color: #333;
  color: #fff;
}

.dark-mode .metallic-button {
  background: linear-gradient(145deg, #555, #777);
  color: #fff;
  border: 1px solid #444;
}

.dark-mode .metallic-button:hover {
  background: linear-gradient(145deg, #777, #555);
}
</style>
