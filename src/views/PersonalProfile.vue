<template>
    <div class="profile-container">
      <h2>User Profile</h2>
      <div v-if="userEmail">
        <p><strong>Email:</strong> {{ userEmail }}</p>
        <div class="profile-picture">
          <img :src="profilePictureUrl" alt="Profile Picture" v-if="profilePictureUrl" />
          <p v-else>No profile picture</p>
        </div>
        <input type="file" @change="uploadProfilePicture" />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
      <button @click="goBackHome">Go back home</button>
    </div>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        userEmail: '',
        profilePictureUrl: null
      };
    },
    created() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userEmail = user.email;
          this.loadProfilePicture(user.uid);
        } else {
          this.$router.push('/login');
        }
      });
    },
    methods: {
      async loadProfilePicture(uid) {
        const db = getFirestore();
        const profilePicRef = doc(collection(db, 'users', uid, 'profilePicture'), 'picture');
        const docSnap = await getDoc(profilePicRef);
  
        if (docSnap.exists()) {
          this.profilePictureUrl = docSnap.data().url;
        } else {
          console.log('No profile picture found.');
        }
      },
      goBackHome(){
        this.$router.push('/');
      },
      uploadProfilePicture(event) {
        const file = event.target.files[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = async () => {
          const base64String = reader.result;
  
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;
  
          const db = getFirestore();
          const profilePicRef = doc(collection(db, 'users', user.uid, 'profilePicture'), 'picture');
  
          try {
            await setDoc(profilePicRef, { url: base64String });
            this.profilePictureUrl = base64String;
            alert('Profile picture uploaded successfully.');
          } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture. Please try again later.');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
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
  
  p {
    font-size: 16px;
  }
  
  .profile-picture img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  input[type="file"] {
    display: block;
    margin-top: 10px;
  }
  </style>