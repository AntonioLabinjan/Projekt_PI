<template>
    <div :class="{ 'dark-mode': darkMode }">
      <h1 class="h1" :class="{'dark-mode': darkMode}">QR Code Gallery</h1>
      <hr>
      <div v-if="qrCodes.length > 0" class="image-grid">
        <div v-for="(qr, index) in qrCodes" :key="index" class="image-container">
          <img :src="qr.url" alt="QR Code Image" class="img-fluid" />
        </div>
      </div>
      <div v-else>
        <p>No QR codes found.</p>
      </div>
      <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
      <button @click="editAsAdmin">Edit as admin</button>
      <button type="button" @click="goBack">Go back</button>
    </div>
  </template>
  
  <script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import 'firebase/storage';
  import { db } from '@/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

  
  export default {
    data() {
      return {
        qrCodes: [],
        newQRCode: { url: '' },
        darkMode: false,
        imageFile: null,
      };
    },
    async created() {
      await this.loadImages();
    },
    methods: {
      async loadImages() {
        const imageCollection = collection(db, 'qrCodes');
        const snapshot = await getDocs(imageCollection);
        this.qrCodes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.newQRCode.url = e.target.result;
          };
          reader.readAsDataURL(file);
          this.imageFile = file;
        }
      },
      async uploadImage() {
        if (this.newQRCode.url && this.imageFile) {
          const storageRef = firebase.storage().ref();
          const fileRef = storageRef.child(`qrCodes/${this.imageFile.name}`);
          await fileRef.put(this.imageFile);
          const url = await fileRef.getDownloadURL();
          await this.$db.collection('qrCodes').add({
            url: url
          });
          this.qrCodes.push({ id: (await db.collection('qrCodes').add({url: url})).id, url: url });
          this.newQRCode = {  url: '' };
          this.imageFile = null;
        }
      },
      async deleteImage(id) {
        await deleteDoc(doc(db, 'qrCodes', id));
        this.qrCodes = this.qrCodes.filter(qr => qr.id !== id);
      },
      toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
      },
      goBack() {
      this.$router.push('/about');
    },
    editAsAdmin(){ // obrisa saan fromPage
      this.$router.push({path:'/admin-login', query: { redirect: '/qr-codes-admin'}});
    },
    }
  };
  </script>
      
    <style scoped>
    .dark-mode {
      background-color: #333;
      color: #fff;
    }
    
    .h1.dark-mode {
      color: #ffcc00;
    }
    
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .image-container {
      position: relative;
      text-align: center;
    }
    
    .img-fluid {
      max-width: 100%;
      border-radius: 5px;
    }
    
    .btn-danger {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #DC3545;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .form-container {
      margin-bottom: 20px;
    }
    
    button.btn-primary {
      background-color: #4CAF50;
      color: #fff;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 3px;
    }
    </style>
    