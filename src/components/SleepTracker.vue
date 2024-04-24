<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>Sleep Tracker</h1>
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToTrainingApp" class="btn btn-secondary">Go to Training App</button></li>
        <li><button @click="goToImageGallery" class="btn btn-secondary">Go to Image Gallery</button></li>
        <li><button @click="goToMealTracker" class="btn btn-secondary">Go to Meal Tracker</button></li>
        <li><button @click="goToWaterIntake" class="btn btn-secondary">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak">Go to Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer">Music Player</button></li>
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul> 
    </nav>
    <hr>

    <form v-if="!editEntry" @submit.prevent="addOrEditSleepEntry" class="sleep-input-section">
      <h3 v-if="!editEntry">Sleep Entry</h3>
      <h3 v-else>Edit Sleep Entry</h3>
      <label for="date">Date:</label>
      <input v-model="newSleepEntry.date" type="date" id="date" required />

      <label for="startTime">Start Time:</label>
      <input v-model="newSleepEntry.startTime" type="time" id="startTime" required />

      <label for="wakeTime">Wake Time:</label>
      <input v-model="newSleepEntry.wakeTime" type="time" id="wakeTime" required />

      <label for="quality">Quality (1-10):</label>
      <input v-model="newSleepEntry.quality" type="number" id="quality" min="1" max="10" required />

      <button v-if="!editEntry" type="submit">Add Sleep Entry</button>
      <button v-else type="submit">Save</button>
      <button v-if="editEntry" @click="cancelEdit">Cancel</button>
    </form>

    <ul class="sleep-display-section">
      <li v-for="(entry, index) in sleepEntries" :key="index" class="sleep-item">
        <strong>Date:</strong> {{ entry.date }},
        <strong>Start Time:</strong> {{ entry.startTime }},
        <strong>Wake Time:</strong> {{ entry.wakeTime }},
        <strong>Quality:</strong> {{ entry.quality }}
        <strong>Duration:</strong> {{ calculateDuration(entry) }}
        <button class="edit-btn" @click="editSleepEntry(index)">Edit</button>
        <button class="delete-btn" @click="deleteSleepEntry(entry.id)">Delete</button>
      </li>
    </ul>

    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>

    <div class="statistics">
      <strong>Total Entries:</strong> {{ totalEntries }}<br>
      <strong>Average Quality:</strong> {{ averageQuality }}
    </div>

    <div v-if="showAlert" class="alert">
      <p>Između nekih uzastopnih unosa za san ima i po više od 2 dana! Razmislite o tome da malo popravite sleep schedule. OVO NIKAKO NIJE ZDRAVO!!!</p>
      <button @click="hideAlert" class="close-btn">x</button>
    </div>
  </div>
  <user-bar></user-bar>
</template>

<script>
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  data() {
    return {
      darkMode: false,
      newSleepEntry: {
        date: "",
        startTime: "",
        wakeTime: "",
        quality: 0,
      },
      sleepEntries: [],
      editIndex: null,
      editEntry: false,
      previousEntryDate: null,
      showAlert: false,
    };
  },
  computed: {
    totalEntries() {
      return this.sleepEntries.length;
    },
    averageQuality() {
      const totalQuality = this.sleepEntries.reduce((acc, entry) => acc + entry.quality, 0);
      return this.totalEntries ? (totalQuality / this.totalEntries).toFixed(2) : '0.00';
    },
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
    },
    goToTrainingApp() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToWaterIntake() {
      this.$router.push({ path: '/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator' });
    },
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
    goToMusicPlayer() {
      this.$router.push({ path: '/music' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    addOrEditSleepEntry() {
      if (this.editEntry) {
        this.saveEditedSleepEntry();
      } else {
        this.addSleepEntry();
        this.checkDateDifference(); 
      }
    },
    async addSleepEntry() {
  try {
    const docRef = await addDoc(collection(db, 'sleepEntries'), this.newSleepEntry);
    console.log('Document written with ID: ', docRef.id);
    
    this.previousEntryDate = this.newSleepEntry.date; 

    this.resetForm();
    this.checkDateDifference();
  } catch (error) {
    console.error('Error adding document: ', error);
  }
},


checkDateDifference() {
  if (this.previousEntryDate) {
    const currentDate = new Date(this.newSleepEntry.date);
    const previousDate = new Date(this.previousEntryDate);
    const differenceInDays = Math.abs((currentDate - previousDate) / (1000 * 60 * 60 * 24));
    
    if(differenceInDays > 2) {
      this.showAlert = true;
    } 
  } else {
    this.showAlert = false;
  }
},

editSleepEntry(index) {
  this.editIndex = index;
  this.newSleepEntry = { ...this.sleepEntries[index] };
  this.editEntry = true;
  this.previousEntryDate = this.newSleepEntry.date; 
},
    async saveEditedSleepEntry() {
      try {
        await updateDoc(doc(db, 'sleepEntries', this.sleepEntries[this.editIndex].id), this.newSleepEntry);
        console.log('Document successfully updated');
        this.resetForm();
        this.editEntry = false;
        this.editIndex = null;
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    },
    async deleteSleepEntry(id) {
      try {
        await deleteDoc(doc(db, 'sleepEntries', id));
        console.log('Document successfully deleted');
      } catch (error) {
        console.error('Error removing document: ', error);
      }
    },
    cancelEdit() {
      this.editEntry = false;
      this.editIndex = null;
      this.resetForm();
    },
    resetForm() {
      this.newSleepEntry = {
        date: "",
        startTime: "",
        wakeTime: "",
        quality: 0,
      };
    },
    calculateDuration(entry) {
      const { startTime, wakeTime } = entry;
      if (typeof startTime !== 'string' || typeof wakeTime !== 'string') {
        return 'Invalid time format';
      }

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);
      let durationInMinutes;
      if (wakeHour < startHour || (wakeHour === startHour && wakeMinute < startMinute)) {
        durationInMinutes = (wakeHour + 24) * 60 + wakeMinute - startHour * 60 - startMinute;
      } else {
        durationInMinutes = wakeHour * 60 + wakeMinute - startHour * 60 - startMinute;
      }
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `${hours}h ${minutes}m`;
    },
    hideAlert() {
    this.showAlert = false;
  },
  },
  mounted() {
    try {
      onSnapshot(collection(db, 'sleepEntries'), (querySnapshot) => {
        const updatedSleepEntries = [];
        querySnapshot.forEach((doc) => {
          const sleepEntryData = doc.data();
          sleepEntryData.id = doc.id;
          updatedSleepEntries.push(sleepEntryData);
        });
        this.sleepEntries = updatedSleepEntries;
      });
    } catch (error) {
      console.error('Error fetching sleep entries:', error);
    }
  }
};
</script>

<style scoped>
.container.dark-mode {
  background-color: #000;
  color: #fff;
}

.alert {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8d7da; 
  color: #721c24; 
  border: 1px solid #f5c6cb; 
  border-radius: 4px; 
}
</style>
