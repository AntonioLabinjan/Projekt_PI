<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h2>Sign Up</h2>
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
        <label for="dob">Date of Birth</label>
        <input type="date" class="form-control" id="dob" v-model="dob" required>
      </div>
      <div class="form-group">
        <label for="signupUsername">Username</label>
        <input type="text" class="form-control" id="signupUsername" v-model="signupUsername" required>
      </div>
      <div class="form-group">
        <label for="signupPassword">Password</label>
        <input type="password" class="form-control" id="signupPassword" v-model="signupPassword" required>
      </div>
      
      <div class="button-group">
        <button type="submit" class="btn btn-primary">Sign Up</button>
        <button @click="goToLogIn" class="btn btn-secondary">Login</button>
        <button @click="goBackHome" class="btn btn-secondary">Home</button>
        <br>
        <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      firstName: '',
      lastName: '',
      dob: '',
      signupUsername: '',
      signupPassword: ''
    }
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
    signUp() {
      // Implementacija logike za registraciju (ovo ćemo isto riješit naknadno)
      console.log('Signing up with first name:', this.firstName, 'last name:', this.lastName, 'date of birth:', this.dob, 'username:', this.signupUsername, 'and password:', this.signupPassword);
    },
    goToLogIn() {
      this.$router.push({ path: '/login' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style scoped>
.signup-container {
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

.container.dark-mode {
  background-color: #000;
  color: #fff;
}

</style>
