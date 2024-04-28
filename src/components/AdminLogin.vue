<template>
    <div>
      <h1>Login</h1>
      <input v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <button @click="login">Login</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        trueEmail: 'admin@trainingApp.com', // Ovo je email koji moramo upisat
        truePassword: '123456789', // Ovo je lozinka koju moramo upisat
        isLoggedIn: false
      };
    },
    methods: {
        login() {
  console.log("Current route path:", this.$route.path); // Ovo ni pomoglo, samo me još više buni
  if (this.email === 'admin@trainingApp.com' && this.password === '123456789') {
    this.isLoggedIn = true;
    switch (this.$route.path) {
      case '/NA-exercises':
        this.$router.push('/default-exercises');
        break;
      case '/NA-meals':
        this.$router.push('/default-meals');
        break;
      default:
        // Ako nismo ni na jednoj, preusmjerimo se na default početnu stranicu
        this.$router.push('/');
        break;
    }
  } else {
    alert('Invalid credentials');
  }
}

    }
  }
  </script>
  
