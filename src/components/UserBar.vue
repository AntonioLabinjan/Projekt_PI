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
  background-color: #58CA2B; 
  padding: 15px; 
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.user-info p {
  margin-bottom: 15px; 
}

button {
  padding: 10px 20px;
  background-color: #007bff; 
  color: #fff; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; 
}

button:hover {
  background-color: #0056b3;
}

</style>
