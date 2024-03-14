<template>
  <div class="signup-container">
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
      <!-- ovo je neki basic template za signup; vjerojatno ću ga izmjenit s nekin bootsrapon ili nečin -->
      <div class="button-group">
        <button type="submit" class="btn btn-primary">Sign Up</button>
        <button @click="goToLogIn" class="btn btn-secondary">Login</button>
        <button @click="goBackHome" class="btn btn-secondary">Home</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      dob: '',
      signupUsername: '',
      signupPassword: ''
    }
  },
  methods: {
    signUp() {
      // Implementacija logike za registraciju (ovo ćemo isto riješit naknadno)
      console.log('Signing up with first name:', this.firstName, 'last name:', this.lastName, 'date of birth:', this.dob, 'username:', this.signupUsername, 'and password:', this.signupPassword); // ovo mi trenutno samo ispisuje stvari u konzolu..beskorisno je, ali napravio sam to čisto da se nešto dešava kad kliknem
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
</style>
