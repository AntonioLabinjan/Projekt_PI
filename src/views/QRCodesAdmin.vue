/* eslint-disable */
<template>
  <div :class="{ 'dark-mode': darkMode }">
    <h1 class="h1" :class="{'dark-mode': darkMode}">QR Code Gallery</h1>
    <hr>
    <div v-for="(qrCode, index) in qrCodes" :key="index" class="qr-code">
      <img :src="qrCode.url" alt="QR Code Image">
      <button @click="editQRCode(index)" class="metallic-button edit">Edit</button>
      <button @click="deleteQRCode(index)" class="metallic-button delete">Delete</button>
      <hr>
    </div>

    <h2 v-if="editMode">Edit QR code</h2>
    <h2 v-else>Add new QR code</h2>
    <form @submit.prevent="submitQRCode">
      <label>Title:</label>
      <input type="text" v-model="newQRCode.title" required><br>
      <label>Image URL:</label>
      <input type="url" v-model="newQRCode.url" required><br>
      <button type="submit" v-if="editMode" class="metallic-button">Save changes</button>
      <button type="submit" v-else class="metallic-button">Add QR code</button>
      <button type="button" @click="cancelEdit" v-if="editMode" class="metallic-button">Cancel</button>
      <button type="button" @click="goBack" class="metallic-button">Go back</button>
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
        title: '',
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
        title: this.newQRCode.title,
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
        title: '',
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

<style>
.qr-code {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

input {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.metallic-button {
  background: linear-gradient(145deg, #d4d4d4a8, #ffffff);
  border: 1px solid #ccc;
  color: #000;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 5px;
  transition: background 0.3s, box-shadow 0.3s;
  cursor: pointer;
  margin-right: 10px;
}

.metallic-button:hover {
  background: linear-gradient(145deg, #ffffff, #d4d4d4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode {
  background-color: #333;
  color: #fff;
}

.dark-mode .h1 {
  color: #fff;
}

.dark-mode input {
  background-color: #555;
  color: #fff;
  border: 1px solid #777;
}
</style>
