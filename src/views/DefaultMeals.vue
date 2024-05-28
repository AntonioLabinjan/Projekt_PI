<template>
  <div class="container" :class="{'dark-mode': darkMode}">
    <h1 class="h1" :class="{'dark-mode': darkMode}">Galerija Obroka</h1>
    <hr>
    <!-- Prikaz hardkodiranih obroka -->
    <div v-for="(meal, index) in meals" :key="index" class="meal">
      <h2>{{ meal.name }}</h2>
      <p><strong>Glavni sastojak:</strong> {{ meal.mainIngredient }}</p>
      <p><strong>Kalorije:</strong> {{ meal.calories }}</p>
      <p><strong>Opis:</strong> {{ meal.description }}</p>
      <img :src="meal.image" alt="Primjer obroka">
      <button @click="editMeal(index)" class="edit">Uredi</button>
      <button @click="deleteMeal(index)" class="delete">Obriši</button>
      <hr>
    </div>

    <h2 v-if="editMode">Uredi obrok</h2>
    <h2 v-else>Dodaj novi obrok</h2>
    <form @submit.prevent="submitMeal">
      <label>Naziv obroka:</label>
      <input type="text" v-model="newMeal.name" required><br>
      <label>Glavni sastojak:</label>
      <input type="text" v-model="newMeal.mainIngredient" required><br>
      <label>Kalorije:</label>
      <input type="number" v-model="newMeal.calories" required><br>
      <label>Opis:</label>
      <textarea v-model="newMeal.description" required></textarea><br>
      <label>Slika URL:</label>
      <input type="url" v-model="newMeal.image" required><br>
      <button type="submit" v-if="editMode">Spremi promjene</button>
      <button @click="submitMeal">Dodaj obrok</button>
      <button type="button" @click="cancelEdit" v-if="editMode">Odustani</button>
    </form>
    
    <button @click="goBack">Go Back</button>
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
</template>

<script>

import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      meals: [],
      newMeal: {
        name: '',
        mainIngredient: '',
        calories: 0,
        description: '',
        image: ''
      },
      editIndex: null,
      editMode: false,
      darkMode: false,
    };
  },
  created() {
    this.fetchMeals();
  },
  methods: {
    goBack() {
      this.$router.push('/about');
    },
    async fetchMeals() {
      const querySnapshot = await getDocs(collection(db, "mealSuggestions"));
      this.meals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async addMeal() {
      await addDoc(collection(db, "mealSuggestions"), {
        name: this.newMeal.name,
        mainIngredient: this.newMeal.mainIngredient,
        calories: this.newMeal.calories,
        description: this.newMeal.description,
        url: this.newMeal.image
      });
      this.fetchMeals();
      this.resetForm();
    },
    editMeal(index) {
      this.editIndex = index;
      this.newMeal = { ...this.meals[index] };
      this.newMeal.image = this.newMeal.url;
      this.editMode = true;
    },
    async updateMeal() {
      if (this.editIndex !== null) {
        const mealId = this.meals[this.editIndex].id;
        await updateDoc(doc(db, "mealSuggestions", mealId), {
          name: this.newMeal.name,
          mainIngredient: this.newMeal.mainIngredient,
          calories: this.newMeal.calories,
          description: this.newMeal.description,
          url: this.newMeal.image
        });
        this.fetchMeals();
        this.resetForm();
      }
    },
    submitMeal() {
      if (this.editMode) {
        this.updateMeal();
      } else {
        this.addMeal();
      }
    },
    async deleteMeal(index) {
      const mealId = this.meals[index].id;
      await deleteDoc(doc(db, 'mealSuggestions', mealId));
      this.fetchMeals();
    },
    resetForm() {
      this.newMeal = { name: '', mainIngredient: '', calories: 0, description: '', image: '' };
      this.editIndex = null;
      this.editMode = false;
    },
    cancelEdit() {
      this.resetForm();
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
  }
};
</script>
<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f2f2f2;
  margin: 0;
  padding: 0;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
}

/* Stilizacija pojedinačnih obroka */
.meal {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
}

.meal img {
  max-width: 100%; /* Maksimalna širina slike je 100% roditeljskog elementa */
  height: auto; /* Održavanje proporcija slike */
  margin-top: 10px;
  object-fit: contain; /* Osigurava da se slika neće izrezati, ali će se prilagoditi dimenzijama */
  max-height: 200px; /* Maksimalna visina slike */
}
/* Stilizacija gumba */
button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
  margin-left: 5px;
}

button.delete {
  background-color: #dc3545;
}

button.edit {
  background-color: #28a745;
}

/* Stilizacija forme */
form {
  margin-top: 20px;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 5px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input[type="text"],
form input[type="number"],
form textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

form button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 3px;
}
.container.dark-mode {
  background-color: #000;
  color: #fff;
}

.h1.dark-mode{
  background-color: #000;
  color: #fff;
}
</style>
