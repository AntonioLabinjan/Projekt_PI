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
    console.log("Entered email:", this.email);
    console.log("Entered password:", this.password);
    console.log("Expected email:", this.trueEmail);
    console.log("Expected password:", this.truePassword);

    console.log("Current route path:", this.$route.path);
    if(this.email.trim().toLowerCase() === this.trueEmail.toLowerCase() && this.password.trim() === this.truePassword){
        this.isLoggedIn = true;
        const redirectPath = this.$route.query.redirect || '/';
        console.log(`Redirecting to ${redirectPath}`);
        this.$router.push(redirectPath);
    } else {
        console.log("Login failed, redirecting to /error");
        this.$router.push('/error');
    }
  }
}




    }
  
  </script>
  
