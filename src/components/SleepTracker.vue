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
// Importamo Vuex store
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
      sleepEntries: this.$store.state.sleepEntries,
      editIndex: null,
      editEntry: false,
    };
  },
  computed: {
    totalEntries() {
      return this.$store.getters.totalSleepEntries;
    },
    averageQuality() {
      return this.$store.getters.averageSleepQuality;
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
      this.$store.dispatch('addSleepEntry', { ...this.newSleepEntry });
      this.resetForm();
    },
    editSleepEntry(index) {
      this.editIndex = index;
      this.newSleepEntry = { ...this.sleepEntries[index] };
      this.editEntry = true;
    },
    saveEditedSleepEntry() {
      this.$store.dispatch('editSleepEntry', { index: this.editIndex, entry: { ...this.newSleepEntry } });
      this.resetForm();
      this.editEntry = false;
      this.editIndex = null;
    },
    deleteSleepEntry(index) {
      this.$store.dispatch('removeSleepEntry', index);
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
        durationInMinutes = (wakeHour + 24) * 60 + wakeMinute - startHour * 60 - startMinute;
      } else {
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
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
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
  color: #333; /* Tamno siva boja za oznake */
}

input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc; /* Siva granica */
  border-radius: 4px; /* Zaobljeni rubovi */
}

/* Stilizacija za gumbove */
button {
  padding: 10px 20px;
  margin-top: 10px;
  color: #fff; /* Bijela boja teksta */
  background-color: #007bff; /* Plava pozadina */
  border: none; /* Bez granice */
  border-radius: 4px; /* Zaobljeni rubovi */
  cursor: pointer; /* Pokazivač miša */
  transition: background-color 0.3s ease; /* Glatki prijelaz boje */
}

/* Stilizacija za gumbove koji su oznaceni kao cancel */
button.cancel {
  background-color: #dc3545; /* Crvena pozadina */
}

/* Stilizacija za sekciju sa prikazom vježbi */
ul.exercise-display-section {
  list-style: none; /* Ukloni oznake liste */
  padding: 0; /* Ukloni unutarnji razmak */
}

.exercise-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd; /* Siva granica */
  border-radius: 4px; /* Zaobljeni rubovi */
  background-color: #fff; /* Bijela pozadina */
}

/* Stilizacija za gumbove za uređivanje i brisanje */
.edit-btn {
  margin-right: 10px;
  color: #fff; /* Bijela boja teksta */
  background-color: #28a745; /* Zelena pozadina */
}

.delete-btn {
  color: #fff; /* Bijela boja teksta */
  background-color: #dc3545; /* Crvena pozadina */
}

/* Responsivni stilovi za mobilne uređaje */
@media only screen and (max-width: 600px) {
  #app {
    width: 90%; /* Smanji širinu aplikacije na mobilnim uređajima */
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
