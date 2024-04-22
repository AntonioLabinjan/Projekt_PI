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
        <button class="delete-btn" @click="deleteMeal(meal.id)">Delete</button> 
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
  <user-bar></user-bar>
</template>

<script>
// import { ref, onMounted } from 'vue'
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  data() {
    return {
      darkMode: false,
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
      ingredientFilter: "",
      pieChartContext: null,
      pieChartData: [],
      pieChartColors: ['#ff6d38', '#ffc107', '#28a745', '#007bff', '#dc3545', '#6c757d', '#17a2b8', '#343a40', '#6f42c1', '#fd7e14'],
    };
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
    filteredMealsByIngredient() {
      if (!this.ingredientFilter) {
        return this.meals;
      }
      return this.meals.filter(meal => meal.ingredients.toLowerCase().includes(this.ingredientFilter.toLowerCase()));
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
    async addMeal() {
      try {
        const mealRef = await addDoc(collection(db, 'meals'), this.newMeal);
        console.log('Meal added successfully:', mealRef.id);
        this.resetForm();
        this.updatePieChart();
      } catch (error) {
        console.error('Error adding meal:', error);
      }
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editedMeal = { ...this.meals[index] };
    },
    async saveEdit() {
      try {
        await updateDoc(doc(db, 'meals', this.meals[this.editIndex].id), this.editedMeal);
        console.log('Meal updated successfully:', this.meals[this.editIndex].id);
        this.editIndex = null;
        this.editedMeal = {
          name: "",
          ingredients: "",
          calories: 0,
        };
        this.updatePieChart();
      } catch (error) {
        console.error('Error updating meal:', error);
      }
    },
    confirmDeleteMeal(index) {
      const isConfirmed = window.confirm("Do you really want to delete this meal?");
      if (isConfirmed) {
        this.deleteMeal(index);
      }
    },
    async deleteMeal(id) {
      try {
        await deleteDoc(doc(db, 'meals', id));
        console.log('Meal deleted successfully:', id);
        this.updatePieChart();
      } catch (error) {
        console.error('Error deleting meal:', error);
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
      const canvas = this.$refs.pieChartCanvas;
      canvas.width = 300;
      canvas.height = 300;
      this.pieChartContext = canvas.getContext('2d');
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY);

      const totalCalories = this.meals.reduce((total, meal) => total + meal.calories, 0);

      this.pieChartData = this.meals.map(meal => {
        return {
          name: meal.name,
          percentage: (meal.calories / totalCalories) * 100
        };
      });

      let startAngle = 0;
      this.pieChartData.forEach((data, index) => {
        const sliceAngle = (data.percentage / 100) * Math.PI * 2;

        this.pieChartContext.fillStyle = this.pieChartColors[index];
        this.pieChartContext.beginPath();
        this.pieChartContext.moveTo(centerX, centerY);
        this.pieChartContext.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        this.pieChartContext.closePath();
        this.pieChartContext.fill();

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
      this.$router.push({path: '/streak'});
    },
  },
  async mounted() {
    try {
      onSnapshot(collection(db, 'meals'), (querySnapshot) => {
        const updatedMeals = [];
        querySnapshot.forEach((doc) => {
          const mealData = doc.data();
          mealData.id = doc.id;
          updatedMeals.push(mealData);
        });
        this.meals = updatedMeals;
      });
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  }
};
</script>
<style scoped>
/* CSS styles for meal tracker component */
.container.dark-mode {
  background-color: #000;
  color: #fff;
}



.pie-chart-section {
  text-align: center;
}
</style>
