<template>
    <div class="user-info" v-if="currentUser">
      <p><b>Trenutno ulogirani korisnik:</b> {{ currentUser.email }}</p>
      <li><button @click="logout">Odlogiraj se</button></li>
    </div>
  </template>
  
  <script>
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { auth } from '@/firebase';
  
  export default {
    data() {
      return {
        currentUser: null,
      };
    },
    methods: {
      async logout() {
        try {
          await signOut(auth);
          window.alert("Uspješno ste se odlogirali.");
          this.$router.push('/');
        } catch (error) {
          console.error('Greška prilikom odlogiranja:', error);
          window.alert("Došlo je do pogreške prilikom odlogiranja.");
        }
      },
    },
    mounted() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = null;
        }
      });
    },
  };
  </script>
  
  <style scoped>
  .user-info {
    margin-top: 20px;
    text-align: center;
  }
  </style>
  
