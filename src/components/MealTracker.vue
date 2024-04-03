<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
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
          <li><button @click="goToMusicPlayer">Music Player</button></li>
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

    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    
    <div class="statistics">
      <strong>Total Calories:</strong> {{ totalCalories }} kcal<br>
      <strong>Total Meals:</strong> {{ totalMeals }}<br>
      <strong>Average Calories per Meal:</strong> {{ averageCaloriesPerMeal }} kcal
    </div>
    <div class="ingredient-filter-section">
      <label for="ingredientFilter">Filter by Ingredient:</label>
      <input v-model="ingredientFilter" type="text" id="ingredientFilter" placeholder="Enter ingredient" />
    </div>
    
    <div class="pie-chart-section">
      <h3>Pie Chart - Calories per Meal</h3>
      <canvas ref="pieChartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      newMeal: {
        name: "",
        ingredients: "",
        calories: 0,
      },
      editIndex: null,
      editedMeal: {
        name: "",
        ingredients: "",
        calories: 0,
      },
      ingredientFilter: "",
      pieChartContext: null,
      pieChartData: [],
      pieChartColors: ['#ff6d38', '#ffc107', '#28a745', '#007bff', '#dc3545', '#6c757d', '#17a2b8', '#343a40', '#6f42c1', '#fd7e14'],
    };
  },
  computed: {
    totalCalories() {
      return this.$store.getters.totalCalories; // Povezivanje sa Vuex store-om
    },
    totalMeals() {
      return this.$store.getters.totalMeals; // Povezivanje sa Vuex store-om
    },
    averageCaloriesPerMeal() {
      return this.$store.getters.averageCaloriesPerMeal; // Povezivanje sa Vuex store-om
    },
    filteredMealsByIngredient() {
      const meals = this.$store.state.meals; // Povezivanje sa Vuex store-om
      if (!this.ingredientFilter) {
        return meals;
      }
      return meals.filter(meal => meal.ingredients.toLowerCase().includes(this.ingredientFilter.toLowerCase()));
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
    addMeal() {
      this.$store.dispatch('addMeal', { ...this.newMeal }); // Povezivanje sa Vuex store-om
      this.resetForm();
      this.updatePieChart();
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editedMeal = { ...this.filteredMealsByIngredient[index] };
    },
    saveEdit() {
      this.$store.dispatch('updateMeal', { index: this.editIndex, meal: { ...this.editedMeal } }); // Povezivanje sa Vuex store-om
      this.editIndex = null;
      this.editedMeal = {
        name: "",
        ingredients: "",
        calories: 0,
      };
      this.updatePieChart();
    },
    confirmDeleteMeal(index) {
      const isConfirmed = window.confirm("Do you really want to delete this meal?");
      if (isConfirmed) {
        this.$store.dispatch('deleteMeal', index); // Povezivanje sa Vuex store-om
      }
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
    updatePieChart() {
      // Postavite veličinu canvasa
      const canvas = this.$refs.pieChartCanvas;
      canvas.width = 300;
      canvas.height = 300;
      this.pieChartContext = canvas.getContext('2d');
      
      // Postavite središte grafikona
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY);

      // Izračunaj ukupne kalorije
      const totalCalories = this.$store.state.meals.reduce((total, meal) => total + meal.calories, 0);

      // Izračunajte udjele kalorija za svaki obrok
      this.pieChartData = this.$store.state.meals.map(meal => {
        return {
          name: meal.name,
          percentage: (meal.calories / totalCalories) * 100
        };
      });

      // Nacrtajte pie chart
      let startAngle = 0;
      this.pieChartData.forEach((data, index) => {
        const sliceAngle = (data.percentage / 100) * Math.PI * 2;

        this.pieChartContext.fillStyle = this.pieChartColors[index];
        this.pieChartContext.beginPath();
        this.pieChartContext.moveTo(centerX, centerY);
        this.pieChartContext.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        this.pieChartContext.closePath();
        this.pieChartContext.fill();

        // Postavite kutove za sljedeći segment
        startAngle += sliceAngle;
      });
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
      this.$router.push({ path: '/streak' });
    },
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
    },
  },
  mounted() {
    this.updatePieChart();
  }
};
</script>

<style scoped>
.container.dark-mode {
  background-color: #000;
  color: #fff;
}

.pie-chart-section {
  text-align: center;
}
</style>
