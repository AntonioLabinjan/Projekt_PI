<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>Exercise Tracker</h1>
    <!-- Navbar -->
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToMealTracker" class="btn-secondary">Go to Meal Tracker</button></li>
        <li><button @click="goToImageGallery" class="btn-secondary">Go to Image Gallery</button></li>
        <li><button @click="goToSleepTracker" class="btn-secondary">Go to Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake" class="btn-secondary">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI" class="btn-secondary">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak" class="btn-secondary">Go to Streak Tracker</button></li>
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul>
    </nav>
    <hr>
    <!-- Content -->
    <form v-if="editIndex === null" @submit.prevent="addExercise" class="exercise-input-section">
      <h3>Exercise Info</h3>
      <label for="exerciseName">Exercise Name:</label>
      <input v-model="newExercise.name" type="text" id="exerciseName" required />

      <label for="exerciseDuration">Duration (min):</label>
      <input v-model="newExercise.duration" type="number" id="exerciseDuration" required />

      <label for="exerciseIntensity">Intensity:</label>
      <input v-model="newExercise.intensity" type="text" id="exerciseIntensity" required />

      <label for="exerciseCalories">Spent Calories:</label>
      <input v-model="newExercise.calories" type="number" id="exerciseCalories" required />

      <button type="submit">Add Exercise</button>
    </form>

    <form v-else-if="editIndex !== null" @submit.prevent="saveEdit" class="exercise-input-section">
      <label for="editExerciseName">Exercise Name:</label>
      <input v-model="editedExercise.name" type="text" id="editExerciseName" required />

      <label for="editExerciseDuration">Duration (min):</label>
      <input v-model="editedExercise.duration" type="number" id="editExerciseDuration" required />

      <label for="editExerciseIntensity">Intensity:</label>
      <input v-model="editedExercise.intensity" type="text" id="editExerciseIntensity" required />

      <label for="editExerciseCalories">Spent Calories:</label>
      <input v-model="editedExercise.calories" type="number" id="editExerciseCalories" required />

      <button type="submit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </form>

    <ul class="exercise-display-section">
      <li v-for="(exercise, index) in filteredExercises" :key="index" class="exercise-item">
        <strong>Exercise Name:</strong> {{ exercise.name }}<br>
        <strong>Duration (min):</strong> {{ exercise.duration }}<br>
        <strong>Intensity:</strong> {{ exercise.intensity }}<br>
        <strong>Spent Calories:</strong> {{ exercise.calories }} kcal<br>
        <button class="edit-btn" @click="openEditDialog(index)">Edit</button>
        <button class="delete-btn" @click="confirmDeleteExercise(index)">Delete</button>
      </li>
    </ul>

    <div class="statistics">
      <strong>Total Calories:</strong> {{ totalCalories }} kcal<br>
      <strong>Total Duration:</strong> {{ totalDuration }} min<br>
      <strong>Total Exercises:</strong> {{ totalExercises }}<br>
      <strong>Average Calories per Exercise:</strong> {{ averageCaloriesPerExercise }} kcal
    </div>

    <div class="filter-container">
      <label for="intensityFilter">Filter by Intensity:</label>
      <input v-model="intensityFilter" type="text" id="intensityFilter" />
      <button @click="filterByIntensity" class="btn btn-primary">Apply Filter</button>
    </div>

    <!-- Pie Chart container -->
    <div class="pie-chart-section">
      <h3>Exercise Duration Pie Chart</h3>
      <canvas ref="pieChartCanvas"></canvas>
    </div>
    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      newExercise: {
        name: "",
        duration: 0,
        intensity: "",
        calories: 0,
      },
      exercises: [],
      editIndex: null,
      editedExercise: {
        name: "",
        duration: 0,
        intensity: "",
        calories: 0,
      },
      intensityFilter: "",
      pieChartContext: null,
      pieChartData: [],
      pieChartColors: ['#ff6d38', '#ffc107', '#28a745', '#007bff', '#dc3545', '#6c757d', '#17a2b8', '#343a40', '#6f42c1', '#fd7e14'],
    };
  },
  computed: {
    totalCalories() {
      return this.exercises.reduce((total, exercise) => total + exercise.calories, 0);
    },
    totalDuration() {
      return this.exercises.reduce((total, exercise) => total + exercise.duration, 0);
    },
    totalExercises() {
      return this.exercises.length;
    },
    averageCaloriesPerExercise() {
      if (this.totalExercises === 0) {
        return 0;
      }
      return (this.totalCalories / this.totalExercises).toFixed(2);
    },
    filteredExercises() {
      if (!this.intensityFilter) {
        return this.exercises;
      }
      return this.exercises.filter(exercise => exercise.intensity.includes(this.intensityFilter));
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
    goToMealTracker() {
      this.$router.push({ path:'/meal-tracker' });
    },
    goToImageGallery() {
      this.$router.push({ path:'/image-gallery' });
    },
    goToSleepTracker() {
      this.$router.push({ path:'/sleep-tracker' });
    },
    goToWaterIntake() {
      this.$router.push({ path:'/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path:'/BMI-calculator' });
    },
    goToStreak() {
      this.$router.push({ path:'/streak' });
    },
    goBackHome(){
      this.$router.push({ path: '/' });
    },
    addExercise() {
      this.exercises.push({ ...this.newExercise });
      this.resetForm();
      this.updatePieChart();
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editedExercise = { ...this.exercises[index] };
    },
    saveEdit() {
      this.exercises[this.editIndex] = { ...this.editedExercise };
      this.editIndex = null;
      this.editedExercise = {
        name: "",
        duration: 0,
        intensity: "",
        calories: 0,
      };
      this.updatePieChart();
    },
    confirmDeleteExercise(index) {
      const isConfirmed = window.confirm("Do you really want to delete this exercise?");
      if (isConfirmed) {
        this.deleteExercise(index);
      }
    },
    deleteExercise(index) {
      this.exercises.splice(index, 1);
      this.updatePieChart();
    },
    cancelEdit() {
      this.editIndex = null;
      this.editedExercise = {
        name: "",
        duration: 0,
        intensity: "",
        calories: 0,
      };
    },
    resetForm() {
      this.newExercise = {
        name: "",
        duration: 0,
        intensity: "",
        calories: 0,
      };
    },
    filterByIntensity() {
      if (!this.intensityFilter) {
        return this.exercises;
      }
      return this.exercises.filter(exercise => exercise.intensity.includes(this.intensityFilter));
    },
    updatePieChart() {
      const canvas = this.$refs.pieChartCanvas;
      canvas.width = 300;
      canvas.height = 300;
      this.pieChartContext = canvas.getContext('2d');

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY);
      
      // Exercise duration data
      const exerciseDurationData = this.exercises.reduce((total, exercise) =>total + exercise.duration, 0);

      this.pieChartData = this.exercises.map(exercise => {
        return {
          name: exercise.name,
          percentage: (exercise.duration / exerciseDurationData) * 100
        };
      });
      
      let startAngle = 0;
      this.pieChartData.forEach((data, index) => {
        const sliceAngle = (data.percentage / 100) * Math.PI *2;

        this.pieChartContext.fillStyle = this.pieChartColors[index];
        this.pieChartContext.beginPath();
        this.pieChartContext.moveTo(centerX, centerY);
        this.pieChartContext.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        this.pieChartContext.closePath();
        this.pieChartContext.fill();

        startAngle += sliceAngle;
      });
    },
  },
};
</script>

<style scoped>
/* CSS styles for exercise tracker component */
.container.dark-mode {
  background-color: #000;
  color: #fff;
}
.container {
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
hr {
  border-top: 1px solid #ccc;
  margin: 20px 0;
}
.exercise-input-section,
.statistics,
.filter-container {
  margin-top: 20px;
}
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
input,
textarea {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px;
  margin-top: 10px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
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
.filter-container {
  display: flex;
  align-items: center;
}
.filter-container label {
  margin-right: 10px;
}
.filter-container input {
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.filter-container button {
  margin-top: 0;
  padding: 8px 15px;
}
.pie-chart-section {
  text-align: center;
}
@media only screen and (max-width: 600px){
  #app {
    width: 90%;
}
}
</style>
