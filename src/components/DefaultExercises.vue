<template>
  <div :class="{ 'dark-mode': darkMode }">
    <h1 class="display-4">Galerija Vježbi</h1>
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

    <!-- Forma za dodavanje/novo uređivanje vježbe -->
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
      <img src = "../assets/QR1.png" alt = "QR kod za vježbu">
      
    </div>
    <!-- Button to go back to the about page -->
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
     exercises: [
  { name: 'Čučnjevi', reps: 12, sets: 3, duration: '1 minuta', bodyPart: 'Noge', instructions: 'Stanite uspravno, spustite se kao da sjedite na stolicu, zatim se vratite u početni položaj.', image: 'https://th.bing.com/th/id/R.7501f29ab92bb18f2fba9c4311a453ca?rik=74830ZTxqOoXYQ&pid=ImgRaw&r=0' },
  { name: 'Sklekovi', reps: 15, sets: 4, duration: '30 sekundi', bodyPart: 'Prsa', instructions: 'Postavite ruke na tlo malo šire od širine ramena, spustite se prema dolje savijajući laktove, a zatim se vratite u početni položaj.', image: 'https://th.bing.com/th/id/OIP.zpJ5qP9dxrz4GiOlUTIR6wHaFj?rs=1&pid=ImgDetMain' },
  { name: 'Trbušnjaci', reps: 20, sets: 3, duration: '45 sekundi', bodyPart: 'Trbuh', instructions: 'Lezite na leđa, savijte koljena i stavite ruke iza glave, podignite trup prema koljenima, zatim se polako spustite.', image: 'https://th.bing.com/th/id/R.aa1695a0ee2288c1d71ce76d6c3823b2?rik=FYS2N5QHE3vhEA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-9xyqnGPL7W4%2fU8YQ9gn-4kI%2fAAAAAAAAB9w%2fm2dR23py-LM%2fs1600%2fClassic%2bsit%2bup.JPG&ehk=OD9vm5tbb4rplSze%2bx8p7MRP3L7Sz5eoss6s0Vt10Hw%3d&risl=&pid=ImgRaw&r=0' },
  { name: 'Zgibovi', reps: 10, sets: 3, duration: '45 sekundi', bodyPart: 'Leđa', instructions: 'Pripazite da su ruke postavljene šire od ramena, izvucite se prema gore, zatim se polako spustite.', image: 'https://th.bing.com/th/id/R.6e0cab381052bba64d9266f87000f505?rik=jgabsxSYHiwbew&pid=ImgRaw&r=0' },
  { name: 'Plank', reps: '1 minuta', sets: 3, duration: '1 minuta', bodyPart: 'Trup', instructions: 'Postavite se na podlaktice i nožne prste, održavajte tijelo ravno, kao daska, i zadržite poziciju.', image: 'https://th.bing.com/th/id/OIP.JYvi473LvxLJ7ksfUqOxMAHaE8?w=800&h=534&rs=1&pid=ImgDetMain' },
  { name: 'Dizanje utega', reps: 12, sets: 3, duration: '1 minuta', bodyPart: 'Ruke', instructions: 'Stanite uspravno s utegom u ruci, savijte laktove i podignite utege prema gore, zatim polako spustite.', image: 'https://th.bing.com/th/id/R.409bd68de8e1417cc843851ae76558d4?rik=f2vSBwCzSNyajw&pid=ImgRaw&r=0' },
  { name: 'Burpees', reps: 10, sets: 3, duration: '45 sekundi', bodyPart: 'Cijelo tijelo', instructions: 'Počnite stojeći, spustite se u sklek, zatim se brzo vratite u stojeći položaj i skočite što više možete.', image: 'https://th.bing.com/th/id/R.f9b312999b7a6a2b9ab6a74f8a3cfb04?rik=9pfLifcFxN%2fr7g&pid=ImgRaw&r=0' },
  { name: 'Planche', reps: '30 sekundi', sets: 3, duration: '30 sekundi', bodyPart: 'Ruke, trup', instructions: 'Postavite ruke na tlo i izbacite noge u zrak, održavajući tijelo paralelno s podlogom.', image: 'https://fitnesspurity.com/wp-content/uploads/2016/12/3-5.jpg' },
  { name: 'Biciklistički trbušnjaci', reps: 20, sets: 3, duration: '1 minuta', bodyPart: 'Trbuh', instructions: 'Lezite na leđa, stavite ruke iza glave, podignite noge i izmjenjujte ih kao da vozite bicikl, dodirujući koljena laktovima.', image: 'https://th.bing.com/th/id/R.dc81ded9454bd60d418116ea60632337?rik=wkHKnWUSWRr4Bg&pid=ImgRaw&r=0' }
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
      editMode: false,
      darkMode: false,
    };
  },
  methods: {
    addExercise() {
      // Dodavanje nove vježbe u listu
      this.exercises.push({ ...this.newExercise });
      // Resetiranje forme za unos nove vježbe
      this.resetForm();
    },
    editExercise(index) {
      // Postavljanje podataka o vježbi u formu za uređivanje
      this.newExercise = { ...this.exercises[index] };
      this.editIndex = index;
      this.editMode = true;
    },
    deleteExercise(index) {
      // Brisanje vježbe iz liste
      this.exercises.splice(index, 1);
    },
    submitExercise() {
      if (this.editMode) {
        // Ažuriranje postojeće vježbe
        this.exercises.splice(this.editIndex, 1, { ...this.newExercise });
        this.resetForm();
      } else {
        // Dodavanje nove vježbe
        this.addExercise();
      }
    },
    cancelEdit() {
      // Poništavanje uređivanja i resetiranje forme
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
    toggleDarkMode() {
  this.darkMode = !this.darkMode;
  const app = document.getElementById('app');
  if (this.darkMode) {
    app.classList.add('dark-mode');
  } else {
    app.classList.remove('dark-mode');
  }
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

.dark-mode {
  background-color: #333;
  color: #fff;
}

</style>
