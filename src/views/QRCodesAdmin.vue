<template>
    <div :class="{ 'dark-mode': darkMode }">
      <h1 class="h1" :class="{'dark-mode': darkMode}">QR Code Gallery</h1>
      <hr>
      <!-- Prikaz QR kodova -->
      <div v-for="(qrCode, index) in qrCodes" :key="index" class="qr-code">
        <img :src="qrCode.url" alt="QR Code Image">
        <button @click="editQRCode(index)" class="edit">Uredi</button>
        <button @click="deleteQRCode(index)" class="delete">Obriši</button>
        <hr>
      </div>
  
      <h2 v-if="editMode">Uredi QR kod</h2>
      <h2 v-else>Dodaj novi QR kod</h2>
      <form @submit.prevent="submitQRCode">
        <label>Naslov QR koda:</label>
        <input type="text" v-model="newQRCode.title" required><br>
        <label>Slika URL:</label>
        <input type="url" v-model="newQRCode.url" required><br>
        <button type="submit" v-if="editMode">Spremi promjene</button>
        <button type="submit" v-else>Dodaj QR kod</button>
        <button type="button" @click="cancelEdit" v-if="editMode">Odustani</button>
        <button type="button" @click="goBack">Go back</button>
      </form>
    </div>
  </template>
<script>
import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      qrCodes: [],
      newQRCode: {
        url: ''
      },
      editIndex: null,
      editMode: false,
      darkMode: false,
    };
  },
  created() {
    this.fetchQRs();
  },
  methods: {
    async fetchQRs() {
      const querySnapshot = await getDocs(collection(db, "qrCodes"));
      this.qrCodes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async addQRCode() {
      await addDoc(collection(db, "qrCodes"), {
        url: this.newQRCode.url
      });
      this.fetchQRs();
      this.resetForm();
    },
    editQRCode(index) {
      this.editIndex = index;
      this.newQRCode = { ...this.qrCodes[index] };
      this.editMode = true;
    },
    async updateQRCode() {
      if (this.editIndex !== null) {
        const qrCodeId = this.qrCodes[this.editIndex].id;
        await updateDoc(doc(db, "qrCodes", qrCodeId), {
          title: this.newQRCode.title,
          url: this.newQRCode.url
        });
        this.fetchQRs();
        this.resetForm();
      }
    },
    async deleteQRCode(index) {
      const qrCodeId = this.qrCodes[index].id;
      await deleteDoc(doc(db, "qrCodes", qrCodeId));
      this.fetchQRs();
    },
    submitQRCode() {
      if (this.editMode) {
        this.updateQRCode();
      } else {
        this.addQRCode();
      }
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.newQRCode = {
        url: ''
      };
      this.editIndex = null;
      this.editMode = false;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      const app = document.getElementById('app');
      if (this.darkMode) {
        app.classList.add('dark-mode');
      } else {
        app.classList.remove('dark-mode');
      }
    },
    goBack() {
      this.$router.push('/about');
    }
  }
};
</script>
  