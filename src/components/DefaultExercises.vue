<template>
  <div id="app">
    <h1>Galerija Vježbi</h1>
    <hr>
    <!-- Prikaz hardkodiranih vježbi -->
    <div v-for="(exercise, index) in exercises" :key="index" class="exercise">
      <h2>{{ exercise.name }}</h2>
      <p><strong>Broj ponavljanja:</strong> {{ exercise.reps }}</p>
      <p><strong>Broj setova:</strong> {{ exercise.sets }}</p>
      <p><strong>Trajanje:</strong> {{ exercise.duration }}</p>
      <p><strong>Dio tijela:</strong> {{ exercise.bodyPart }}</p>
      <p><strong>Upute:</strong> {{ exercise.instructions }}</p>
      <img :src="exercise.image" alt="Demonstracija vježbe">
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
    
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
     exercises: [
  { name: 'Čučnjevi', reps: 12, sets: 3, duration: '1 minuta', bodyPart: 'Noge', instructions: 'Stanite uspravno, spustite se kao da sjedite na stolicu, zatim se vratite u početni položaj.', image: 'https://th.bing.com/th/id/R.7501f29ab92bb18f2fba9c4311a453ca?rik=74830ZTxqOoXYQ&pid=ImgRaw&r=0' },
],

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
      editMode: false
    };
  },
  methods: {
    addExercise() {
      this.exercises.push({ ...this.newExercise });
      this.resetForm();
    },
    editExercise(index) {
      this.newExercise = { ...this.exercises[index] };
      this.editIndex = index;
      this.editMode = true;
    },
    deleteExercise(index) {
      this.exercises.splice(index, 1);
    },
    submitExercise() {
      if (this.editMode) {
        // Ažuriranje postojeće vježbe
        this.exercises.splice(this.editIndex, 1, { ...this.newExercise });
        this.resetForm();
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
    goBack() {
      this.$router.push({ path: '/about' });
    },
  }
};
</script>

<style scoped>
/* Globalni stilovi */
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

/* Stilizacija pojedinačnih vježbi */
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
</style
