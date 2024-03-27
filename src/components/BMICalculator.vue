<template>
  <div :class="{ 'dark-mode': darkMode }">
    <h1 class="display-4">BMI Calculator</h1>
    
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <ul class="navbar-nav">
        <li class="nav-item"><button @click="goToVueTrainer" class="btn btn-secondary">Go to Training app</button></li>
        <li class="nav-item"><button @click="goToImageGallery" class="btn btn-secondary">Go to Image Gallery</button></li>
        <li class="nav-item"><button @click="goToSleepTracker" class="btn btn-secondary">Go to Sleep Tracker</button></li>
        <li class="nav-item"><button @click="goToMealTracker" class="btn btn-secondary">Go to Meal Tracker</button></li>
        <li class="nav-item"><button @click="goToWaterIntake" class="btn btn-secondary">Go to Water Intake Tracker</button></li>
        <li class="nav-item"><button @click="goToStreak" class="btn btn-secondary">Go to Streak Tracker</button></li>
        <li class="nav-item"><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
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
      <button type="submit" class="btn btn-primary">Calculate BMI</button>
    </form>

    <div v-if="bmi" class="bmi-result" :class="bmiColor">
      <p>Your BMI: {{ bmi }}</p>
    </div>
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
  </div>
</template>

<script>
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
      if (!this.bmi) return ''; // Default background color if BMI is not calculated yet
      if (this.bmi < 18.5) {
        return 'bg-primary'; // Underweight
      } else if (this.bmi >= 18.5 && this.bmi <= 24.9) {
        return 'bg-success'; // Normal
      } else if (this.bmi >= 25 && this.bmi <= 29.9) {
        return 'bg-warning'; // Overweight (less than 15% above normal)
      } else {
        return 'bg-danger'; // Obese (more than 15% above normal)
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
  background-color: #007bff; /* Blue */
}

.bg-success {
  background-color: #28a745; /* Green */
}

.bg-warning {
  background-color: #ffc107; /* Yellow */
}

.bg-danger {
  background-color: #dc3545; /* Red */
}

.dark-mode {
  background-color: #333;
  color: #fff;
}

@media only screen and (max-width: 600px) {
  #app {
    width: 90%;
  }
}
</style>
