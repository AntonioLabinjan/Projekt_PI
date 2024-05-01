<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>Exercise Tracker</h1>
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToMealTracker" class="btn-secondary">Go to Meal Tracker</button></li>
        <li><button @click="goToImageGallery" class="btn-secondary">Go to Image Gallery</button></li>
        <li><button @click="goToSleepTracker" class="btn-secondary">Go to Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake" class="btn-secondary">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI" class="btn-secondary">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak" class="btn-secondary">Go to Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer">Music Player</button></li>
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul>
    </nav>
    <hr>
    <form @submit.prevent="addExercise" class="exercise-input-section">
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

    <ul class="exercise-display-section">
      <li v-for="(exercise, index) in filteredExercises" :key="index" class="exercise-item">
        <strong>Exercise Name:</strong> {{ exercise.name }}<br>
        <strong>Duration (min):</strong> {{ exercise.duration }}<br>
        <strong>Intensity:</strong> {{ exercise.intensity }}<br>
        <strong>Spent Calories:</strong> {{ exercise.calories }} kcal<br>
        <button class="edit-btn" @click="openEditDialog(index)">Edit</button>
        <button class="delete-btn" @click="confirmDeleteExercise(exercise.id)">Delete</button>
      </li>
    </ul>

    <div v-if="editIndex !== null" class="edit-form">
      <h3>Edit Exercise</h3>
      <label for="editedExerciseName">Exercise Name:</label>
      <input v-model="editedExercise.name" type="text" id="editedExerciseName" required />

      <label for="editedExerciseDuration">Duration (min):</label>
      <input v-model="editedExercise.duration" type="number" id="editedExerciseDuration" required />

      <label for="editedExerciseIntensity">Intensity:</label>
      <input v-model="editedExercise.intensity" type="text" id="editedExerciseIntensity" required />

      <label for="editedExerciseCalories">Spent Calories:</label>
      <input v-model="editedExercise.calories" type="number" id="editedExerciseCalories" required />

      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>

    <div class="statistics">
      <strong>Total Calories:</strong> {{ totalCalories }} kcal<br>
      <strong>Total Duration:</strong> {{ totalExerciseDuration }} min<br>
      <strong>Total Exercises:</strong> {{ totalExercises }}<br>
      <strong>Average Calories per Exercise:</strong> {{ averageCaloriesPerExercise }} kcal
    </div>

    <div class="filter-container">
      <label for="intensityFilter">Filter by Intensity:</label>
      <input v-model="intensityFilter" type="text" id="intensityFilter" />
      <button @click="filterByIntensity" class="btn btn-primary">Apply Filter</button>
    </div>

    <div class="pie-chart-section">
      <h3>Exercise Duration Pie Chart</h3>
      <canvas ref="pieChartCanvas"></canvas>
    </div>
    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
  <user-bar></user-bar>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

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
      editIndex: null,
      editedExercise: {
        id: "",
        name: "",
        duration: 0,
        intensity: "",
        calories: 0
      },
      intensityFilter: "",
      pieChartContext: null,
      pieChartData: [],
      pieChartColors: ['#ff6d38', '#ffc107', '#28a745', '#007bff', '#dc3545', '#6c757d', '#17a2b8', '#343a40', '#6f42c1', '#fd7e14'],
      exercises: [],
    };
  },
  computed: {
    totalCalories() {
      return this.exercises.reduce((total, exercise) => total + exercise.calories, 0);
    },
    totalExerciseDuration() {
      return this.exercises.reduce((total, exercise) => total + exercise.duration, 0);
    },
    totalExercises() {
      return this.exercises.length;
    },
    averageCaloriesPerExercise() {
      return this.totalCalories / this.totalExercises || 0;
    },
    filteredExercises() {
      return this.intensityFilter ? this.exercises.filter(exercise => exercise.intensity.toLowerCase().includes(this.intensityFilter.toLowerCase())) : this.exercises;
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
    async addExercise() {
      const auth = getAuth();
      const user = auth.currentUser;
      const userExercisesRef = collection(db, 'users', user.uid, 'exercises');
      await addDoc(userExercisesRef, this.newExercise);
      this.newExercise = { name: "", duration: 0, intensity: "", calories: 0 };
    },
    async confirmDeleteExercise(id) {
      const auth = getAuth();
      const user = auth.currentUser;
      await deleteDoc(doc(db, 'users', user.uid, 'exercises', id));
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editedExercise = { ...this.filteredExercises[index], id: this.filteredExercises[index].id };
    },
    async saveEdit() {
      const auth = getAuth();
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid, 'exercises', this.editedExercise.id), this.editedExercise);
      this.editIndex = null;
    },
    cancelEdit() {
      this.editIndex = null;
    },
    filterByIntensity() {
      this.updatePieChart();
    },
    updatePieChart() {
  const canvas = this.$refs.pieChartCanvas; 
  if (canvas && canvas.getContext) {

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    const totalDuration = this.totalExerciseDuration;
    if (totalDuration === 0) return; 

    let startAngle = 0;
    this.filteredExercises.forEach((exercise, index) => {
      const sliceAngle = (exercise.duration / totalDuration) * 2 * Math.PI;
      ctx.fillStyle = this.pieChartColors[index % this.pieChartColors.length];
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2); 
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      startAngle += sliceAngle;
    });
  }
},

    goBackHome(){
      this.$router.push('/')
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
      this.$router.push({ path:'/bmi' });
    },
    goToStreak() {
      this.$router.push({ path:'/streak' });
    },
    goToMusicPlayer() {
      this.$router.push({ path:'/music' });
    },

  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const exercisesRef = collection(db, 'users', user.uid, 'exercises');
        onSnapshot(exercisesRef, (snapshot) => {
          this.exercises = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.updatePieChart();
        });
      }
    });
  }
};
</script>
<style scoped>
.dark-mode {
  background-color: #222;
  color: #fff;
}
.navbar {
  margin-bottom: 20px;
}
.navbar-nav {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}
.navbar-nav li {
  margin-right: 10px;
}
.exercise-input-section {
  margin-bottom: 20px;
}
.exercise-display-section {
  list-style-type: none;
  padding: 0;
}
.exercise-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}
.edit-btn, .delete-btn {
  margin-left: 10px;
}
.edit-form {
  margin-bottom: 20px;
}
.statistics {
  margin-bottom: 20px;
}
.filter-container {
  margin-bottom: 20px;
}
.pie-chart-section {
  margin-bottom: 20px;
}
canvas {
  display: block;
  margin: 0 auto;
}
.pie-chart-section canvas {
  width: 400px;  
  height: 400px; 
}


</style>
