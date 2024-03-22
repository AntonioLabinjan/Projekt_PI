<template>
  <div>
    <h1>Meal Tracker</h1>
    <div>
      <nav class="navbar">
        <ul class="navbar-nav">
          <li><button @click="goToVueTrainer" class="btn-secondary">Go to Training app</button></li>
          <li><button @click="goToImageGallery" class="btn-secondary">Go to Image Gallery</button></li>
          <li><button @click="goToSleepTracker" class="btn-secondary">Go to Sleep Tracker</button></li>
          <li><button @click="goToWaterIntakeTracker" class="btn-secondary">Go to Water Intake Tracker</button></li>
          <li><button @click="goToBMI" class="btn-secondary">Go to BMI Calculator</button></li>
          <li><button @click="goToStreak" class="btn-secondary">Go to Streak Tracker</button></li>
          <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
        </ul>
      </nav>
    </div>
    <hr>
    <form v-if="editIndex === null" @submit.prevent="addMeal" class="meal-input-section">
      <h3>Meal Info</h3>
      <label for="mealName">Meal Name:</label>
      <input v-model="newMeal.name" type="text" id="mealName" required />

      <label for="mealIngredients">Ingredients:</label>
      <textarea v-model="newMeal.ingredients" id="mealIngredients" rows="4" required></textarea>

      <label for="mealCalories">Calories:</label>
      <input v-model="newMeal.calories" type="number" id="mealCalories" required />

      <button type="submit">Add Meal</button>
    </form>

    <form v-else-if="editIndex !== null" @submit.prevent="saveEdit" class="meal-input-section">
      <label for="editMealName">Meal Name:</label>
      <input v-model="editedMeal.name" type="text" id="editMealName" required />

      <label for="editMealIngredients">Ingredients:</label>
      <textarea v-model="editedMeal.ingredients" id="editMealIngredients" rows="4" required></textarea>

      <label for="editMealCalories">Calories:</label>
      <input v-model="editedMeal.calories" type="number" id="editMealCalories" required />

      <button type="submit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </form>

    <ul class="meal-display-section">
      <li v-for="(meal, index) in filteredMealsByIngredient" :key="index" class="meal-item">
        <strong>Meal Name:</strong> {{ meal.name }}<br>
        <strong>Ingredients:</strong> {{ meal.ingredients }}<br>
        <strong>Calories:</strong> {{ meal.calories }} kcal<br>
        <button class="edit-btn" @click="openEditDialog(index)">Edit</button>
        <button class="delete-btn" @click="confirmDeleteMeal(index)">Delete</button>
      </li>
    </ul>

    <div class="statistics">
      <strong>Total Calories:</strong> {{ totalCalories }} kcal<br>
      <strong>Total Meals:</strong> {{ totalMeals }}<br>
      <strong>Average Calories per Meal:</strong> {{ averageCaloriesPerMeal }} kcal
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newMeal: {
        name: "",
        ingredients: "",
        calories: 0,
      },
      meals: [],
      editIndex: null,
      editedMeal: {
        name: "",
        ingredients: "",
        calories: 0,
      },
  },
  computed: {
    totalCalories() {
      return this.meals.reduce((total, meal) => total + meal.calories, 0);
    },
    totalMeals() {
      return this.meals.length;
    },
    averageCaloriesPerMeal() {
      if (this.totalMeals === 0) {
        return 0;
      }
      return (this.totalCalories / this.totalMeals).toFixed(2);
    },
  },
  methods: {
    addMeal() {
      this.meals.push({ ...this.newMeal });
      this.resetForm();
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editedMeal = { ...this.meals[index] };
    },
    saveEdit() {
      this.meals[this.editIndex] = { ...this.editedMeal };
      this.editIndex = null;
      this.editedMeal = {
        name: "",
        ingredients: "",
        calories: 0,
      };
    },
    confirmDeleteMeal(index) {
      const isConfirmed = window.confirm("Do you really want to delete this meal?");
      if (isConfirmed) {
        this.deleteMeal(index);
      }
    },
    deleteMeal(index) {
      this.meals.splice(index, 1);
      this.updatePieChart();
    },
    cancelEdit() {
      this.editIndex = null;
      this.editedMeal = {
        name: "",
        ingredients: "",
        calories: 0,
      };
    },
    resetForm() {
      this.newMeal = {
        name: "",
        ingredients: "",
        calories: 0,
      };
    },

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
    goToWaterIntakeTracker() {
      this.$router.push({ path: '/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator' });
    },
    goToStreak() {
      this.$router.push({path: '/streak'});
    },
  },
};
</script>

<style scoped>
/* CSS styles for meal tracker component */


</style>
