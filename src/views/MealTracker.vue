/* eslint-disable */
<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>Meal Tracker</h1>
    <div>
      <nav class="navbar">
        <ul class="navbar-nav">
          <li><button @click="goToVueTrainer" class="btn btn-secondary metallic-button">Go to Training app</button></li>
          <li><button @click="goToImageGallery" class="btn btn-secondary metallic-button">Go to Image Gallery</button></li>
          <li><button @click="goToSleepTracker" class="btn btn-secondary metallic-button">Go to Sleep Tracker</button></li>
          <li><button @click="goToWaterIntakeTracker" class="btn btn-secondary metallic-button">Go to Water Intake Tracker</button></li>
          <li><button @click="goToBMI" class="btn btn-secondary metallic-button">Go to BMI Calculator</button></li>
          <li><button @click="goToStreak" class="btn btn-secondary metallic-button">Go to Streak Tracker</button></li>
          <li><button @click="goBackHome" class="btn btn-secondary metallic-button">Go back home</button></li>
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

      <button type="submit" class="metallic-button">Add Meal</button>
    </form>

    <form v-else-if="editIndex !== null" @submit.prevent="saveEdit" class="meal-input-section">
      <label for="editMealName">Meal Name:</label>
      <input v-model="editedMeal.name" type="text" id="editMealName" required />

      <label for="editMealIngredients">Ingredients:</label>
      <textarea v-model="editedMeal.ingredients" id="editMealIngredients" rows="4" required></textarea>

      <label for="editMealCalories">Calories:</label>
      <input v-model="editedMeal.calories" type="number" id="editMealCalories" required />

      <button type="submit" class="metallic-button">Save</button>
      <button @click="cancelEdit" class="metallic-button">Cancel</button>
    </form>

    <ul class="meal-display-section">
      <li v-for="(meal, index) in filteredMealsByIngredient" :key="index" class="meal-item">
        <strong>Meal Name:</strong> {{ meal.name }}<br>
        <strong>Ingredients:</strong> {{ meal.ingredients }}<br>
        <strong>Calories:</strong> {{ meal.calories }} kcal<br>
        <button class="edit-btn metallic-button" @click="openEditDialog(index)">Edit</button>
        <button class="delete-btn metallic-button" @click="deleteMeal(meal.id)">Delete</button> 
      </li>
    </ul>

    <button @click="toggleDarkMode" class="metallic-button">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>

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
      <canvas ref="pieChartCanvas" width="400" height="400"></canvas>
    </div>
  </div>
  <user-bar></user-bar>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

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
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userMealsRef = collection(db, 'users', user.uid, 'meals');
        await addDoc(userMealsRef, this.newMeal);
        this.resetForm();
        this.updatePieChart();
      }
    },
    async deleteMeal(id) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid, 'meals', id));
        this.updatePieChart();
      }
    },
    openEditDialog(index) {
      this.editIndex = index;
      this.editedMeal = { ...this.meals[index] };
    },
    async saveEdit() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && this.editIndex !== null) {
        const mealRef = doc(db, 'users', user.uid, 'meals', this.meals[this.editIndex].id);
        await updateDoc(mealRef, this.editedMeal);
        this.editIndex = null;
        this.resetForm();
        this.updatePieChart();
      }
    },
    cancelEdit() {
      this.editIndex = null;
      this.resetForm();
    },
    resetForm() {
      this.newMeal = {
        name: "",
        ingredients: "",
        calories: 0,
      };
      this.editedMeal = {
        name: "",
        ingredients: "",
        calories: 0,
      };
    },
    updatePieChart() {
  const canvas = this.$refs.pieChartCanvas;
  if (canvas) {
    this.pieChartContext = canvas.getContext('2d');
    const ctx = this.pieChartContext;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = this.meals.map(meal => ({
      name: meal.name,
      value: meal.calories
    }));

    if (!data.length) {
      return;
    }

    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    let startAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const color = this.pieChartColors[index % this.pieChartColors.length];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(200, 200); 
      ctx.arc(200, 200, 150, startAngle, endAngle); 
      ctx.closePath();
      ctx.fill();

      startAngle = endAngle;
    });
  }
},

    goBackHome(){
      this.$router.push('/')
    },
    goToVueTrainer() {
      this.$router.push({ path:'/vue-trainer' });
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
    goToWaterIntakeTracker(){
      this.$router.push({path: '/water-intake'})
    }

  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const mealsRef = collection(db, 'users', user.uid, 'meals');
        onSnapshot(mealsRef, (snapshot) => {
          this.meals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.updatePieChart();
        });
      }
    });
  }
};

</script>
<style scoped>
.container.dark-mode {
  background-color: #000;
  color: #fff;
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
.metallic-button {
  background: linear-gradient(to bottom, #8c8c8c, #333);
  border: 1px solid #666;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  transition: 0.3s;
}

.metallic-button:hover {
  background: linear-gradient(to bottom, #333, #8c8c8c);
  border: 1px solid #999;
  transition: 0.3s;
}
</style>
