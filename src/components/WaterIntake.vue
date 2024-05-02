<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>Water Intake Tracker</h1>
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToVueTrainer" class="btn-secondary">Go to Training app</button></li>
        <li><button @click="goToImageGallery" class="btn-secondary">Go to Image Gallery</button></li>
        <li><button @click="goToSleepTracker" class="btn-secondary">Go to Sleep Tracker</button></li>
        <li><button @click="goToMealTracker" class="btn-secondary">Go to Meal Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak">Go to Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer">Music Player</button></li>
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul>
    </nav>
    <hr>
    <form v-if="editIndex === null" @submit.prevent="addIntake" class="intake-input-section">
      <h3>Intake Info</h3>
      <label for="drinkType">Drink Type:</label>
      <input v-model="newIntake.type" type="text" id="drinkType" required />

      <label for="drinkAmount">Amount (ml):</label>
      <input v-model="newIntake.amount" type="number" id="drinkAmount" required />

      <label for="drinkTime">Time:</label>
      <input v-model="newIntake.time" type="datetime-local" id="drinkTime" required />

      <button type="submit">Add Intake</button>
    </form>

    <form v-else-if="editIndex !== null" @submit.prevent="saveEdit" class="intake-input-section">
      <label for="editDrinkType">Drink Type:</label>
      <input v-model="editedIntake.type" type="text" id="editDrinkType" required />

      <label for="editDrinkAmount">Amount (ml):</label>
      <input v-model="editedIntake.amount" type="number" id="editDrinkAmount" required />

      <label for="editDrinkTime">Time:</label>
      <input v-model="editedIntake.time" type="datetime-local" id="editDrinkTime" required />

      <button type="submit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </form>

    <ul class="intake-display-section">
      <li v-for="(intake, index) in waterIntake" :key="index" class="intake-item">
        <strong>Drink Type:</strong> {{ intake.type }}<br>
        <strong>Amount:</strong> {{ intake.amount }} ml<br>
        <strong>Time:</strong> {{ intake.time }}<br>
        <button class="edit-btn" @click="openEditDialog(index)">Edit</button>
        <button class="delete-btn" @click="confirmDeleteIntake(index)">Delete</button>
      </li>
    </ul>

    <div class="statistics">
      <strong>Total Intake:</strong> {{ totalIntake }} ml<br>
      <strong>Total Intakes:</strong> {{ totalIntakes }}<br>
      <strong>Average Intake per Time:</strong> {{ averageIntakePerTime }} ml
    </div>

    <!-- Bar chart koji mijenja boju ovisno o unosu tekućine -->
    <div class="intake-bar-chart" :style="{ backgroundColor: intakeColor }">
      <div class="bar" :style="{ width: barWidth }"></div>
    </div>
    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
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
      waterIntake: [],
      newIntake: {
        type: "",
        amount: 0,
        time: ""
      },
      editIndex: null,
      editedIntake: {
        type: "",
        amount: 0,
        time: ""
      }
    };
  },
  computed: {
    totalIntake() {
      return this.waterIntake.reduce((total, intake) => total + intake.amount, 0);
    },
    totalIntakes() {
      return this.waterIntake.length;
    },
    averageIntakePerTime() {
      if (this.totalIntakes === 0) {
        return 0;
      }
      return (this.totalIntake / this.totalIntakes).toFixed(2);
    },
    intakeColor() {
  const totalIntake = this.waterIntake.reduce((total, intake) => total + intake.amount, 0);

  if (totalIntake >= 2000) {
    return '#28a745'; 
  } else if (totalIntake >= 1000) {
    return '#ffc107'; 
  } else {
    return '#dc3545'; 
  }
},
barWidth() {
  const totalIntake = this.waterIntake.reduce((total, intake) => total + intake.amount, 0);

  return `${Math.min(totalIntake / 4000 * 100, 100)}%`; 
}

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
    async addExercise() {
      const auth = getAuth();
      const user = auth.currentUser;
      const userExercisesRef = collection(db, 'users', user.uid, 'exercises');
      await addDoc(userExercisesRef, this.newExercise);
      this.newExercise = { name: "", duration: 0, intensity: "", calories: 0 };
    },
    async addIntake() {
        const auth = getAuth();
        const user = auth.currentUser;
        const userIntakeRef = collection(db, 'users', user.uid, 'waterIntake');
        await addDoc(userIntakeRef, this.newIntake);
        this.newIntake = {amount: "", type: "", time: ""};
      },

      openEditDialog(index) {
  this.editIndex = index;
  this.editedIntake = { ...this.waterIntake[index] };
},



    async saveEdit() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user && this.editedIntake.id) { 
    try {
      await updateDoc(doc(db, 'users', user.uid, 'waterIntake', this.editedIntake.id), {
        type: this.editedIntake.type,
        amount: this.editedIntake.amount,
        time: this.editedIntake.time
      });
      
      this.waterIntake[this.editIndex] = {...this.editedIntake};
      this.editIndex = null;
      this.editedIntake = { type: "", amount: 0, time: "" };
    } catch (error) {
      console.error('Failed to save edits:', error);
    }
  } else {
    console.error('No user logged in or missing intake ID');
  }
},



    async confirmDeleteIntake(id) {
      const auth = getAuth();
      const user = auth.currentUser;
      await deleteDoc(doc(db, 'users', user.uid, 'waterIntake', id));
    },
    cancelEdit() {
      this.editIndex = null;
      this.editedIntake = {
        type: "",
        amount: 0,
        time: ""
      };
    },
    resetForm() {
      this.newIntake = {
        type: "",
        amount: 0,
        time: ""
      };
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
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator'});
    },
    goToStreak() {
      this.$router.push({ path: '/streak'});
    },
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
    },
  },
  async mounted() {
    const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const WaterRef = collection(db, 'users', user.uid, 'waterIntake')
      onSnapshot(WaterRef, (snapshot) => {
        this.waterIntake = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

.intake-input-section,
.intake-display-section,
.statistics {
  margin-top: 20px;
}

.intake-input-section h3 {
  margin-bottom: 10px;
}

.intake-input-section label,
.intake-item strong {
  display: block;
  margin-bottom: 5px;
  color: #333; 
}

.intake-input-section input,
.intake-input-section button {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc; 
  border-radius: 4px; 
}

.intake-input-section button {
  color: #fff; 
  background-color: #007bff; 
  border: none;
  border-radius: 4px; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.intake-input-section button:hover {
  background-color: #0056b3; 
}

.intake-display-section .intake-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd; 
  border-radius: 4px; 
  background-color: #fff; 
}

.statistics strong {
  display: inline-block;
  width: 200px;
  margin-bottom: 5px;
  color: #555; 
}

.navbar {
  padding: 10px 20px;
}

.navbar-nav {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbar-nav li {
  display: inline;
  margin-right: 10px;
}

.navbar-nav li:last-child {
  margin-right: 0;
}

.edit-btn {
  margin-right: 10px;
  color: #fff; 
  background-color: #28a745; 
}

.delete-btn {
  color: #fff; 
  background-color: #dc3545; 
}

.intake-bar-chart {
  height: 40px; 
  margin-top: 20px; 
  border: 1px solid #ccc; 
  position: relative;
}

.intake-bar-chart .bar {
  height: 100%;
  background-color: #007bff; 
}
</style>
