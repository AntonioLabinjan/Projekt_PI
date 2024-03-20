<template>
  <div>
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

    
  </div>
</template>

<script>
export default {
  data() {
    return {
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

  methods: {
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
/* Stilovi za water intake tracker komponentu */

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
  color: #333; /* Tamno siva boja teksta */
}

.intake-input-section input,
.intake-input-section button {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc; /* Siva granica */
  border-radius: 4px; /* Zaobljeni rubovi */
}

.intake-input-section button {
  color: #fff; /* Bijela boja teksta */
  background-color: #007bff; /* Plava pozadina */
  border: none; /* Bez granice */
  border-radius: 4px; /* Zaobljeni rubovi */
  cursor: pointer; /* Pokazivač miša */
  transition: background-color 0.3s ease; /* Glatki prijelaz boje */
}

.intake-input-section button:hover {
  background-color: #0056b3; /* Tamnoplava pozadina */
}

.intake-display-section .intake-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd; /* Siva granica */
  border-radius: 4px; /* Zaobljeni rubovi */
  background-color: #fff; /* Bijela pozadina */
}

.statistics strong {
  display: inline-block;
  width: 200px;
  margin-bottom: 5px;
  color: #555; /* Siva boja teksta */
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
  color: #fff; /* Bijela boja teksta */
  background-color: #28a745; /* Zelena pozadina */
}

.delete-btn {
  color: #fff; /* Bijela boja teksta */
  background-color: #dc3545; /* Crvena pozadina */
}

/* Stilovi za bar chart */
.intake-bar-chart {
  height: 40px; /* Visina grafikona */
  margin-top: 20px; /* Margina za razdvajanje od ostalih elemenata */
  border: 1px solid #ccc; /* Dodajte granicu grafikonu */
  position: relative; /* Postavite relativnu poziciju */
}

.intake-bar-chart .bar {
  height: 100%;
  background-color: #007bff; /* Boja trake grafikona */
}
</style>
