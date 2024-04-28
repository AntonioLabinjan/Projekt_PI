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
    methods: {login() {
    console.log("Current route path:", this.$route.path);
    if (this.email === this.trueEmail && this.password === this.truePassword) {
        this.isLoggedIn = true;
        const redirectPath = this.$route.query.redirect || '/';
        console.log(`Redirecting to ${redirectPath}`);
        this.$router.push(redirectPath);
    } else {
        this.$router.push('/error');
    }
}



    }
  }
  // sve dela ako se mičen kroz searchbar preko /-a
  </script>
  
