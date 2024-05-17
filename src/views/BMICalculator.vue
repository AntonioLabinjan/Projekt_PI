/* eslint-disable */
<template>
  <div :class="{ 'dark-mode': darkMode }">
    <h1 class="display-4">BMI Calculator</h1>
    
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <ul class="navbar-nav">
        <li class="nav-item"><button @click="goToVueTrainer" class="btn btn-secondary metallic-button"><i class="fas fa-dumbbell"></i> Training app</button></li>
        <li class="nav-item"><button @click="goToImageGallery" class="btn btn-secondary metallic-button"><i class="fas fa-images"></i> Image Gallery</button></li>
        <li class="nav-item"><button @click="goToSleepTracker" class="btn btn-secondary metallic-button"><i class="fas fa-bed"></i> Sleep Tracker</button></li>
        <li class="nav-item"><button @click="goToMealTracker" class="btn btn-secondary metallic-button"><i class="fas fa-utensils"></i> Meal Tracker</button></li>
        <li class="nav-item"><button @click="goToWaterIntake" class="btn btn-secondary metallic-button"><i class="fas fa-tint"></i> Water Intake Tracker</button></li>
        <li class="nav-item"><button @click="goToStreak" class="btn btn-secondary metallic-button"><i class="fas fa-fire"></i> Streak Tracker</button></li>
        <li class="nav-item"><button @click="goToMusicPlayer" class="btn btn-secondary metallic-button"><i class="fas fa-music"></i> Music Player</button></li>
        <li class="nav-item"><button @click="goBackHome" class="btn btn-secondary metallic-button"><i class="fas fa-home"></i> Go back home</button></li>
      </ul>
    </nav>
    <hr>
    <form @submit.prevent="calculateBMI" class="bmi-input-section">
      <div class="form-group">
        <label for="height">Height (cm):</label>
        <input v-model="height" type="number" id="height" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="weight">Weight (kg):</label>
        <input v-model="weight" type="number" id="weight" class="form-control" required />
      </div>
      <button class="btn btn-secondary metallic-button">Calculate BMI</button>
    </form>
    <hr>
    <div v-if="bmi" class="bmi-result" :class="[bmiColor, { 'show-result': bmi }]">
      <p><i class="fas fa-heartbeat"></i> Your BMI: {{ bmi }}</p>
      <p>{{ bmiAdvice }}</p>
    </div>
    <button @click="toggleDarkMode" class="btn btn-dark metallic-button">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
  <user-bar></user-bar>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
export default {
  data() {
    return {
      height: null,
      weight: null,
      bmi: null,
      darkMode: false,
    };
  },
  computed: {
    bmiColor() {
      if (!this.bmi) return ''; // Default 
      if (this.bmi < 18.5) {
        return 'bg-primary'; // Underweight
      } else if (this.bmi >= 18.5 && this.bmi <= 24.9) {
        return 'bg-success'; // Normal
      } else if (this.bmi >= 25 && this.bmi <= 29.9) {
        return 'bg-warning'; // Overweight 
      } else {
        return 'bg-danger'; // Obese 
      }
    },
    bmiAdvice() {
      if (!this.bmi) return '';
      if (this.bmi < 18.5) {
        return 'You are underweight. Please consult a healthcare provider for advice.';
      } else if (this.bmi >= 18.5 && this.bmi <= 24.9) {
        return 'You are in the healthy weight range. Keep it up!';
      } else if (this.bmi >= 25 && this.bmi <= 29.9) {
        return 'You are overweight. Consider consulting a healthcare provider.';
      } else {
        return 'You are obese. Please consult a healthcare provider for advice.';
      }
    }
  },
  methods: {
    calculateBMI() {
      if (!this.height || !this.weight) {
        alert('Please enter both height and weight');
        return;
      }
      const heightInMeters = this.height / 100;
      this.bmi = (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToVueTrainer() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToLogIn() {
      this.$router.push({ path: '/login' });
    },
    goToSignUp() {
      this.$router.push({ path: '/sign-up' });
    },
    goToSleepTracker() {
      this.$router.push({ path: '/sleep-tracker' });
    },
    goToWaterIntake() {
      this.$router.push({ path: '/water-intake' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
    goToMusicPlayer() {
      this.$router.push({ path: '/music' });
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }
};
</script>

<style scoped>
.bmi-input-section {
  margin-top: 20px;
}

.bmi-result {
  margin-top: 20px;
  padding: 10px;
  color: white;
  border-radius: 8px;
  text-align: center;
}

.bg-primary {
  background-color: #007bff; 
}

.bg-success {
  background-color: #28a745; /* Zelena */
}

.bg-warning {
  background-color: #ffc107; /* Žuta */
}

.bg-danger {
  background-color: #dc3545; /* Crvena */
}

.dark-mode {
  background-color: #333;
  color: #fff;
  background-size: cover;
  background-repeat: no-repeat;
}

.nav-item button i {
  margin-right: 5px;
}

.nav-item button:hover {
  transform: translateY(-2px);
}

@media only screen and (max-width: 600px) {
  #app {
    width: 90%;
  }
}

.show-result {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.user-info {
  margin-top: 20px;
  text-align: center;
}

.metallic-button {
  background: linear-gradient(145deg, #7a7a7a, #9d9d9d);
  color: #fff;
  border: 1px solid #8b8b8b;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.metallic-button:hover {
  background: linear-gradient(145deg, #929292, #b5b5b5);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5), 
              -2px -2px 10px rgba(255, 255, 255, 0.4);
}

.metallic-button:active {
  background: linear-gradient(145deg, #5b5b5b, #7e7e7e);
  transform: scale(0.98);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2), 
              -1px -1px 5px rgba(255, 255, 255, 0.1);
}

.metallic-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
