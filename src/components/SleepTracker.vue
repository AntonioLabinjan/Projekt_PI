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
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul> 
    </nav>
<hr>
    <form v-if="!editIndex" @submit.prevent="addOrEditSleepEntry" class="sleep-input-section">
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
        <strong>Duration:</strong> {{ calculateDuration(entry.startTime, entry.wakeTime) }}
        <button class="edit-btn" @click="editSleepEntry(index)">Edit</button>
        <button class="delete-btn" @click="deleteSleepEntry(index)">Delete</button>
      </li>
    </ul>

    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>

    <div class="statistics">
      <strong>Total Entries:</strong> {{ totalEntries }}<br>
      <strong>Average Quality:</strong> {{ averageQuality }}
    </div>
  </div>
</template>

<script>
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
    };
  },
  computed: {
    totalEntries() {
      return this.sleepEntries.length;
    },
    averageQuality() {
      if (this.totalEntries === 0) {
        return 0;
      }
      const totalQuality = this.sleepEntries.reduce((total, entry) => total + entry.quality, 0);
      return (totalQuality / this.totalEntries).toFixed(2);
    },
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    addOrEditSleepEntry() {
      if (this.editEntry) {
        this.saveEditedSleepEntry();
      } else {
        this.addSleepEntry();
      }
    },
    addSleepEntry() {
      this.sleepEntries.push({ ...this.newSleepEntry });
      this.resetForm();
    },
    editSleepEntry(index) {
      this.editIndex = index;
      this.newSleepEntry = { ...this.sleepEntries[index] };
      this.editEntry = true;
    },
    saveEditedSleepEntry() {
      this.sleepEntries[this.editIndex] = { ...this.newSleepEntry };
      this.resetForm();
      this.editEntry = false;
      this.editIndex = null;
    },
    deleteSleepEntry(index) {
      this.sleepEntries.splice(index, 1);
    },
    resetForm() {
      this.newSleepEntry = {
        date: "",
        startTime: "",
        wakeTime: "",
        quality: 0,
      };
    },
    cancelEdit() {
      this.editEntry = false;
      this.editIndex = null;
      this.resetForm();
    },
    calculateDuration(startTime, wakeTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);

      let durationInMinutes;

      if (wakeHour < startHour || (wakeHour === startHour && wakeMinute < startMinute)) {
        // Buđenje se dogodilo nakon ponoći, tada računamo trajanje za dva dana
        durationInMinutes = (wakeHour + 24) * 60 + wakeMinute - startHour * 60 - startMinute;
      } else {
        // Buđenje se dogodilo istog dana
        durationInMinutes = wakeHour * 60 + wakeMinute - startHour * 60 - startMinute;
      }

      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return `${hours}h ${minutes}m`;
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToTrainingApp() {
      this.$router.push({ path: '/vue-trainer' });
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
  },
};
</script>

<style scoped>
.container.dark-mode {
  background-color: #000;
  color: #fff;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  background-color: #f2f2f2; 
  padding: 20px; 
}

h1 {
  text-align: center;
  color: #333; 
}

.user-input-section,
.exercise-input-section,
.statistics {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc; 
  border-radius: 8px; 
  background-color: #f8f8f8; 
}

.user-input-section strong,
.exercise-input-section strong,
.statistics strong {
  color: #555; 
}

form {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
}

label {
  margin-bottom: 5px;
  color: #333; 
}

input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc; 
  border-radius: 4px; 
}

button {
  padding: 10px 20px;
  margin-top: 10px;
  color: #fff; 
  background-color: #007bff; 
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}


button.cancel {
  background-color: #dc3545; 
}

ul.exercise-display-section {
  list-style: none; 
  padding: 0; 
}

.exercise-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd; 
  border-radius: 4px; 
  background-color: #fff; 
}


.edit-btn {
  margin-right: 10px;
  color: #fff; 
  background-color: #28a745; 
}

.delete-btn {
  color: #fff; 
  background-color: #dc3545; 
}

@media only screen and (max-width: 600px) {
  #app {
    width: 90%;
  }
}

.navbar {
  padding: 10px 20px;
}

.navbar-nav {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbar-nav li {
  display: inline;
  margin-right: 10px;
}

.navbar-nav li:last-child {
  margin-right: 0;
}
</style>
