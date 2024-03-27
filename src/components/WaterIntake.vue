<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>Water Intake Tracker</h1>
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToVueTrainer" class="btn-secondary">Go to Training app</button></li>
        <li><button @click="goToImageGallery" class="btn-secondary">Go to Image Gallery</button></li>
        <li><button @click="goToSleepTracker" class="btn-secondary">Go to Sleep Tracker</button></li>
        <li><button @click="goToMealTracker" class="btn-secondary">Go to Meal Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak">Go to Streak Tracker</button></li>
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul>
    </nav>
    <hr>
    <form v-if="editIndex === null" @submit.prevent="addIntake" class="intake-input-section">
      <h3>Intake Info</h3>
      <label for="drinkType">Drink Type:</label>
      <input v-model="newIntake.type" type="text" id="drinkType" required />

      <label for="drinkAmount">Amount (ml):</label>
      <input v-model="newIntake.amount" type="number" id="drinkAmount" required />

      <label for="drinkTime">Time:</label>
      <input v-model="newIntake.time" type="datetime-local" id="drinkTime" required />

      <button type="submit">Add Intake</button>
    </form>

    <form v-else-if="editIndex !== null" @submit.prevent="saveEdit" class="intake-input-section">
      <label for="editDrinkType">Drink Type:</label>
      <input v-model="editedIntake.type" type="text" id="editDrinkType" required />

      <label for="editDrinkAmount">Amount (ml):</label>
      <input v-model="editedIntake.amount" type="number" id="editDrinkAmount" required />

      <label for="editDrinkTime">Time:</label>
      <input v-model="editedIntake.time" type="datetime-local" id="editDrinkTime" required />

      <button type="submit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </form>

    <ul class="intake-display-section">
      <li v-for="(intake, index) in waterIntake" :key="index" class="intake-item">
        <strong>Drink Type:</strong> {{ intake.type }}<br>
        <strong>Amount:</strong> {{ intake.amount }} ml<br>
        <strong>Time:</strong> {{ intake.time }}<br>
        <button class="edit-btn" @click="openEditDialog(index)">Edit</button>
        <button class="delete-btn" @click="confirmDeleteIntake(index)">Delete</button>
      </li>
    </ul>

    <div class="statistics">
      <strong>Total Intake:</strong> {{ totalIntake }} ml<br>
      <strong>Total Intakes:</strong> {{ totalIntakes }}<br>
      <strong>Average Intake per Time:</strong> {{ averageIntakePerTime }} ml
    </div>

    <!-- Bar chart koji mijenja boju ovisno o unosu tekućine -->
    <div class="intake-bar-chart" :style="{ backgroundColor: intakeColor }">
      <div class="bar" :style="{ width: barWidth }"></div>
    </div>
    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      newIntake: {
        type: "",
        amount: 0,
        time: ""
      },
      waterIntake: [],
      editIndex: null,
      editedIntake: {
        type: "",
        amount: 0,
        time: ""
      }
    };
  },
  computed: {
    totalIntake() {
      return this.waterIntake.reduce((total, intake) => total + intake.amount, 0);
    },
    totalIntakes() {
      return this.waterIntake.length;
    },
    averageIntakePerTime() {
      if (this.totalIntakes === 0) {
        return 0;
      }
      return (this.totalIntake / this.totalIntakes).toFixed(2);
    },
    intakeColor() {
      const totalIntake = this.totalIntake;
      if (totalIntake < 2000) {
        return '#dc3545'; // Crvena boja za unos manji od 2000 ml
      } else if (totalIntake >= 2000 && totalIntake < 2500) {
        return '#ff6d38'; // Narančasta boja za unos između 2000 i 2500 ml
      } else if (totalIntake >= 2500 && totalIntake < 3000) {
        return '#ffc107'; // Žuta boja za unos između 2500 i 3000 ml
      } else {
        return '#28a745'; // Zelena boja za unos veći od 3000 ml
      }
    },
    barWidth() {
      const dailyIntake = Math.floor(this.totalIntake / 1000); // Pretvara unos u litre
      const maxWidth = 100; // Maksimalna širina grafikona u pikselima
      return Math.min(dailyIntake * 20, maxWidth) + '%'; // 20 piksela po litri, ograničava na maksimalnu širinu
    }
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
    addIntake() {
      this.waterIntake.push({ ...this.newIntake });
      this.resetForm();
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editedIntake = { ...this.waterIntake[index] };
    },
    saveEdit() {
      this.waterIntake[this.editIndex] = { ...this.editedIntake };
      this.editIndex = null;
      this.editedIntake = {
        type: "",
        amount: 0,
        time: ""
      };
    },
    confirmDeleteIntake(index) {
      const isConfirmed = window.confirm("Do you really want to delete this intake?");
      if (isConfirmed) {
        this.deleteIntake(index);
      }
    },
    deleteIntake(index) {
      this.waterIntake.splice(index, 1);
    },
    cancelEdit() {
      this.editIndex = null;
      this.editedIntake = {
        type: "",
        amount: 0,
        time: ""
      };
    },
    resetForm() {
      this.newIntake = {
        type: "",
        amount: 0,
        time: ""
      };
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToVueTrainer() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToSleepTracker() {
      this.$router.push({ path: '/sleep-tracker' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator'});
    },
    goToStreak() {
      this.$router.push({path: '/streak'});
    },
  }
};
</script>

<style scoped>

.intake-input-section,
.intake-display-section,
.statistics {
  margin-top: 20px;
}

.intake-input-section h3 {
  margin-bottom: 10px;
}

.intake-input-section label,
.intake-item strong {
  display: block;
  margin-bottom: 5px;
  color: #333; 
}

.intake-input-section input,
.intake-input-section button {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc; 
  border-radius: 4px; 
}

.intake-input-section button {
  color: #fff; 
  background-color: #007bff; 
  border: none;
  border-radius: 4px; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.intake-input-section button:hover {
  background-color: #0056b3; 
}

.intake-display-section .intake-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd; 
  border-radius: 4px; 
  background-color: #fff; 
}

.statistics strong {
  display: inline-block;
  width: 200px;
  margin-bottom: 5px;
  color: #555; 
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

.edit-btn {
  margin-right: 10px;
  color: #fff; 
  background-color: #28a745; 
}

.delete-btn {
  color: #fff; 
  background-color: #dc3545; 
}

.intake-bar-chart {
  height: 40px; 
  margin-top: 20px; 
  border: 1px solid #ccc; 
  position: relative;
}

.intake-bar-chart .bar {
  height: 100%;
  background-color: #007bff; 


}

.container.dark-mode {
  background-color: #000;
  color: #fff;
}

</style>
