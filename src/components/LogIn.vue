<template>
  <div class="login-container">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginUsername: '',
      loginPassword: ''
    }
  },
  methods: {
    login() {
      // Implementacija logike za prijavu će biti dodana kasnije (firebase :) )
      console.log('Prijavljivanje s korisničkim imenom:', this.loginUsername, 'i lozinkom:', this.loginPassword);
    },
    goToSignUp() {
      this.$router.push({ path: '/sign-up' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
  }
}
</script>

<style scoped>
</style>
