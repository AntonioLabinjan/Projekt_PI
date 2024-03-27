<template>
  <div class="container" :class="{'dark-mode': darkMode}">
    <h1 class="display-4">Galerija Obroka</h1>
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

    <!-- Forma za dodavanje/novo uređivanje obroka -->
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
      <button type="submit" v-else>Dodaj obrok</button>
      <button type="button" @click="cancelEdit" v-if="editMode">Odustani</button>
    </form>
    
    <!-- Button to go back to the about page -->
    <button @click="goBack">Go Back</button>
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      meals: [
  { name: 'Piletina s rižom', mainIngredient: 'Piletina', calories: 350, description: 'Jednostavan i ukusan obrok s piletinom i rižom.', image: 'https://th.bing.com/th/id/R.8fd11496f3d45066791fed39417a237e?rik=06xBu9A0FTilJg&pid=ImgRaw&r=0' },
  { name: 'Povrtni curry', mainIngredient: 'Povrće', calories: 300, description: 'Zdrav i začinjen curry s raznovrsnim povrćem.', image: 'https://th.bing.com/th/id/OIP.q9NcYeZqQwjUsmUBe8pvowHaLE?w=115&h=192&c=7&r=0&o=5&pid=1.7' },
  { name: 'Tjestenina s pestom', mainIngredient: 'Tjestenina', calories: 400, description: 'Klasični talijanski obrok s tjesteninom i umakom od pesta.', image: 'https://th.bing.com/th/id/OIP.j2QTs_0S8WS2tLjOAcs7gQHaLG?w=189&h=283&c=7&r=0&o=5&pid=1.7' },
  { name: 'Losos sa šparogama', mainIngredient: 'Losos', calories: 450, description: 'Bogati obrok s lososom i svježim šparogama.', image: 'https://th.bing.com/th/id/OIP.AMCHHAb4FN5rM-LwQMtg2AHaHa?w=189&h=189&c=7&r=0&o=5&pid=1.7' },
  { name: 'Salata s tunom', mainIngredient: 'Tuna', calories: 250, description: 'Lagani obrok s tunom i svježim povrćem.', image: 'https://th.bing.com/th/id/OIP.-RebUdOn42ST6UgFA1Y6HAHaE9?w=189&h=126&c=7&r=0&o=5&pid=1.7' },
  { name: 'Pileći sendvič', mainIngredient: 'Piletina', calories: 300, description: 'Klasični pileći sendvič sa salatom i majonezom.', image: 'https://th.bing.com/th/id/R.888daf7be1ae8858ba0608306bf4c0f7?rik=qr6wIL%2bR7aAR4w&pid=ImgRaw&r=0' },
  { name: 'Pizza s rajčicom i mozzarellom', mainIngredient: 'Rajčica', calories: 500, description: 'Sočna pizza s tankim tijestom, rajčicom i svježim mozzarellom.', image: 'https://th.bing.com/th/id/R.a53ddb06e150e57cd84d4750b25827d8?rik=JRPEge%2bybzOWlQ&pid=ImgRaw&r=0' },
  { name: 'Quinoa salata', mainIngredient: 'Quinoa', calories: 350, description: 'Zdrava quinoa salata s povrćem i avokadom, začinjena limunovim sokom.', image: 'https://th.bing.com/th/id/OIP.Sf8p0wwoTX_Va_ixfqqbwwHaLJ?w=189&h=285&c=7&r=0&o=5&pid=1.7' },
  { name: 'Pileća juha', mainIngredient: 'Piletina', calories: 200, description: 'Topla i umirujuća pileća juha s povrćem.', image: 'https://th.bing.com/th/id/OIP.OOgcP-cdwn7AEH9N3Gly5gHaLH?w=189&h=284&c=7&r=0&o=5&pid=1.7' }
],


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
  methods: {
    addMeal() {
      // Dodavanje novog obroka u listu
      this.meals.push({ ...this.newMeal });
      // Resetiranje forme za unos novog obroka
      this.resetForm();
    },
    editMeal(index) {
      // Postavljanje podataka o obroku u formu za uređivanje
      this.newMeal = { ...this.meals[index] };
      this.editIndex = index;
      this.editMode = true;
    },
    deleteMeal(index) {
      // Brisanje obroka iz liste
      this.meals.splice(index, 1);
    },
    submitMeal() {
      if (this.editMode) {
        // Ažuriranje postojećeg obroka
        this.meals.splice(this.editIndex, 1, { ...this.newMeal });
        this.resetForm();
      } else {
        // Dodavanje novog obroka
        this.addMeal();
      }
    },
    cancelEdit() {
      // Poništavanje uređivanja i resetiranje forme
      this.resetForm();
    },
    resetForm() {
      this.newMeal = {
        name: '',
        mainIngredient: '',
        calories: 0,
        description: '',
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
      if(this.darkMode){
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      }
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

/* Stilizacija pojedinačnih obroka */
.meal {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
}

.meal img {
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
.container.dark-mode {
  background-color: #000;
  color: #fff;
}

</style>
