<template>
  <div :class="{ 'dark-mode': darkMode }">
    <h1 class="h1" :class="{'dark-mode': darkMode}">Galerija Vježbi</h1>
    <hr>
    <!-- Prikaz hardkodiranih vježbi -->
    <div v-for="(exercise, index) in exercises" :key="index" class="exercise">
      <h2>{{ exercise.name }}</h2>
      <p><strong>Broj ponavljanja:</strong> {{ exercise.reps }}</p>
      <p><strong>Broj setova:</strong> {{ exercise.sets }}</p>
      <p><strong>Trajanje:</strong> {{ exercise.duration }}</p>
      <p><strong>Dio tijela:</strong> {{ exercise.bodyPart }}</p>
      <p><strong>Upute:</strong> {{ exercise.instructions }}</p>
      <img :src="exercise.url" alt="Demonstracija vježbe">
      <button @click="editExercise(index)" class="edit">Uredi</button>
      <button @click="deleteExercise(index)" class="delete">Obriši</button>
      <hr>
    </div>

    <h2 v-if="editMode">Uredi vježbu</h2>
    <h2 v-else>Dodaj novu vježbu</h2>
    <form @submit.prevent="submitExercise">
      <label>Naziv vježbe:</label>
      <input type="text" v-model="newExercise.name" required><br>
      <label>Broj ponavljanja:</label>
      <input type="number" v-model="newExercise.reps" required><br>
      <label>Broj setova:</label>
      <input type="number" v-model="newExercise.sets" required><br>
      <label>Trajanje:</label>
      <input type="text" v-model="newExercise.duration" required><br>
      <label>Dio tijela:</label>
      <input type="text" v-model="newExercise.bodyPart" required><br>
      <label>Upute:</label>
      <textarea v-model="newExercise.instructions" required></textarea><br>
      <label>Slika URL:</label>
      <input type="url" v-model="newExercise.image" required><br>
      <button type="submit" v-if="editMode">Spremi promjene</button>
      <button type="submit" v-else>Dodaj vježbu</button>
      <button type="button" @click="cancelEdit" v-if="editMode">Odustani</button>
    </form>
    <div>
      
    </div>
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      exercises: [],
      newExercise: {
        name: '',
        reps: 0,
        sets: 0,
        duration: '',
        bodyPart: '',
        instructions: '',
        image: ''
      },
      editIndex: null,
      editMode: false,
      darkMode: false,
    };
  },
  created() {
    this.fetchExercises();
  },
  methods: {
    async fetchExercises() {
      const querySnapshot = await getDocs(collection(db, "exerciseSuggestions"));
      this.exercises = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async addExercise() {
      await addDoc(collection(db, "exerciseSuggestions"), {
        name: this.newExercise.name,
        reps: this.newExercise.reps,
        sets: this.newExercise.sets,
        duration: this.newExercise.duration,
        bodyPart: this.newExercise.bodyPart,
        instructions: this.newExercise.instructions,
        url: this.newExercise.image
      });
      this.fetchExercises();
      this.resetForm();
    },
    editExercise(index) {
      this.editIndex = index;
      this.newExercise = { ...this.exercises[index] };
      this.newExercise.image = this.newExercise.url; 
      this.editMode = true;
    },
    async updateExercise() {
      if (this.editIndex !== null) {
        const exerciseId = this.exercises[this.editIndex].id;
        await updateDoc(doc(db, "exerciseSuggestions", exerciseId), {
          name: this.newExercise.name,
          reps: this.newExercise.reps,
          sets: this.newExercise.sets,
          duration: this.newExercise.duration,
          bodyPart: this.newExercise.bodyPart,
          instructions: this.newExercise.instructions,
          url: this.newExercise.image
        });
        this.fetchExercises();
        this.resetForm();
      }
    },
    async deleteExercise(index) {
      const exerciseId = this.exercises[index].id;
      await deleteDoc(doc(db, "exerciseSuggestions", exerciseId));
      this.fetchExercises();
    },
    submitExercise() {
      if (this.editMode) {
        this.updateExercise();
      } else {
        this.addExercise();
      }
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.newExercise = {
        name: '',
        reps: 0,
        sets: 0,
        duration: '',
        bodyPart: '',
        instructions: '',
        image: ''
      };
      this.editIndex = null;
      this.editMode = false;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      const app = document.getElementById('app');
      if (this.darkMode) {
        app.classList.add('dark-mode');
      } else {
        app.classList.remove('dark-mode');
      }
    },
    goBack(){
      this.$router.push('/about');
    }
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
}

.exercise {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
}

.exercise img {
  max-width: 100%; 
  height: auto; 
  margin-top: 10px;
  object-fit: contain; 
  max-height: 200px; 
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

.dark-mode {
  background-color: #333;
  color: #fff;
}

.h1.dark-mode{
  background-color: #000;
  color: #fff;
}

</style>
