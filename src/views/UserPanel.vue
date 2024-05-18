/* eslint-disable */
<template>
    <div class="users-list">
      <h2>Registered Users</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.username }} - {{ user.email }}
          <button class="btn-secondary" @click ="openGmail(user.email)" >Email</button>
        </li>
      </ul>
      <button class="btn-secondary" @click="goBackHome">Go back home</button>
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        users: []
      };
    },
    async created() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "users"));
        this.users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    methods: {
        goBackHome(){
            this.$router.push('/');
        },
        openGmail(email) {
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
}
    }

  }
  </script>
  
  <style scoped>
  .users-list {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .users-list h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .users-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .users-list li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .users-list li:last-child {
    border-bottom: none;
  }
  
  .btn-secondary {
  background: linear-gradient(to bottom, #757575, #616161);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: linear-gradient(to bottom, #616161, #757575);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.btn-secondary:active {
  transform: translateY(1px);
}

  
  .go-back-button {
    display: block;
    width: 100%;
    margin-top: 20px;
    background-color: #6c757d;
    text-align: center;
  }
  
  .go-back-button:hover {
    background-color: #545b62;
  }
  </style>
