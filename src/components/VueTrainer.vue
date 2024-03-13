<template>
  <div class="container">
    <h1>Exercise Tracker</h1>
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

      </div>
</template>

<script>
export default {
  data() {
    return {
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
    };
  },  
  methods: {
    
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
};
</script>

<style scoped>
  </style>
