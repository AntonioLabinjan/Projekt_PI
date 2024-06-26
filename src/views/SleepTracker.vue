<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>Sleep Tracker</h1>
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToTrainingApp" class="btn btn-secondary">Go to Training App</button></li>
        <li><button @click="goToImageGallery" class="btn btn-secondary">Go to Image Gallery</button></li>
        <li><button @click="goToMealTracker" class="btn btn-secondary">Go to Meal Tracker</button></li>
        <li><button @click="goToWaterIntake" class="btn btn-secondary">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI" class="btn btn-secondary">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak" class="btn btn-secondary">Go to Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer" class="btn btn-secondary">Music Player</button></li>
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul> 
    </nav>
    <hr>

<form v-if="!editEntry" @submit.prevent="addSleepEntry" class="sleep-input-section">
  <h3>Add New Sleep Entry</h3>
  <label for="date">Date:</label>
  <input v-model="newSleepEntry.date" type="date" id="date" required />
  <label for="startTime">Start Time:</label>
  <input v-model="newSleepEntry.startTime" type="time" id="startTime" required />
  <label for="wakeTime">Wake Time:</label>
  <input v-model="newSleepEntry.wakeTime" type="time" id="wakeTime" required />
  <label for="quality">Quality (1-10):</label>
  <input v-model="newSleepEntry.quality" type="number" id="quality" min="1" max="10" required />
  <button type="submit" class="btn btn-secondary">Add Sleep Entry</button>
</form>

<form v-else @submit.prevent="saveEditedSleepEntry" class="sleep-input-section">
  <h3>Edit Sleep Entry</h3>
  <label for="date">Date:</label>
  <input v-model="newSleepEntry.date" type="date" id="date" required />
  <label for="startTime">Start Time:</label>
  <input v-model="newSleepEntry.startTime" type="time" id="startTime" required />
  <label for="wakeTime">Wake Time:</label>
  <input v-model="newSleepEntry.wakeTime" type="time" id="wakeTime" required />
  <label for="quality">Quality (1-10):</label>
  <input v-model="newSleepEntry.quality" type="number" id="quality" min="1" max="10" required />
  <button type="submit">Save Changes</button>
  <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
</form>

    <ul class="sleep-display-section">
      <li v-for="(entry, index) in sleepEntries" :key="index" class="sleep-item">
        <strong>Date:</strong> {{ entry.date }},
        <strong>Start Time:</strong> {{ entry.startTime }},
        <strong>Wake Time:</strong> {{ entry.wakeTime }},
        <strong>Quality:</strong> {{ entry.quality }}
        <strong>Duration:</strong> {{ calculateDuration(entry) }}
        <button class="btn btn-secondary" @click="editSleepEntry(index)">Edit</button>
        <button class="btn btn-secondary" @click="deleteSleepEntry(entry.id)">Delete</button>
      </li>
    </ul>

    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>

    <div class="statistics">
      <strong>Total Entries:</strong> {{ totalEntries }}<br>
      <strong>Average Quality:</strong> {{ averageQuality }}
    </div>

    <div v-if="showAlert" class="alert">
      <p>Schedules for sleep entries sometimes have intervals of more than 2 days between them! Consider adjusting your sleep schedule a bit. THIS IS DEFINITELY NOT HEALTHY!!!</p>
      <button @click="hideAlert" class="close-btn">x</button>
    </div>
  </div>
  <user-bar></user-bar>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }

    const userSleepRef = collection(db, 'users', user.uid, 'sleepEntries');
    
    if (this.newSleepEntry.date) {
      this.checkDateDifference();
    }

    const docRef = await addDoc(userSleepRef, this.newSleepEntry);
    console.log('Document written with ID: ', docRef.id);

    this.previousEntryDate = this.newSleepEntry.date;

    this.newSleepEntry = {date: "", quality: 0, startTime: "", wakeTime: ""};
    this.resetForm();
    
  } catch (error) {
    console.error('Error adding document: ', error);
  }
},

checkDateDifference() {
  let differenceInDays = 0;  

  if (this.previousEntryDate && this.newSleepEntry.date) {
    const currentDate = new Date(this.newSleepEntry.date);
    const previousDate = new Date(this.previousEntryDate);
    differenceInDays = Math.abs((currentDate - previousDate) / (1000 * 60 * 60 * 24));
  }

  if (differenceInDays > 2) {
    console.log("Fix sleep schedule");
    this.showAlert = true;
  } else {
    console.log("OK");
    this.showAlert = false;
  }
},

editSleepEntry(index) {
  this.editIndex = index;
  this.newSleepEntry = { ...this.sleepEntries[index] };
  this.editEntry = true;
},
async saveEditedSleepEntry() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      return;
    }
    const docRef = doc(db, 'users', user.uid, 'sleepEntries', this.sleepEntries[this.editIndex].id);
    await updateDoc(docRef, this.newSleepEntry);
    console.log('Document successfully updated');
    this.resetForm();
    this.editEntry = false;
    this.editIndex = null;
  } catch (error) {
    console.error('Error updating document: ', error);
  }
},
    async deleteSleepEntry(id) {
      const auth =  getAuth();
      const user = auth.currentUser;
      await deleteDoc(doc(db, 'users', user.uid, 'sleepEntries', id))  
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
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const sleepRef = collection(db, 'users', user.uid, 'sleepEntries');
      onSnapshot(sleepRef, (snapshot) => {
        this.sleepEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    }
  });

  
}, }

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
</style>
