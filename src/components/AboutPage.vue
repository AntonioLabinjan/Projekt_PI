<template>
  <div class="about" :class="{ 'dark-mode': darkMode }">
    <h2>About Vue Trainer</h2>
    <hr>
    <p>Welcome to <b>Vue Trainer</b>, your ultimate fitness companion!</p>
    <p>With Vue Trainer, you can easily track your progress in various aspects of your health and fitness journey:</p>
    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>

    <div class="feature-list">
      <div class="feature">
        <h3 class="feature-title">Track Progress</h3>
        <p>Add images, height, and weight to monitor your progress visually.</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Exercise Management</h3>
        <p>Add completed exercises, including duration, intensity, and calories burned.</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Meal Tracking</h3>
        <p>Add meals, their ingredients, and calorie content to maintain a balanced diet.</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Sleep Monitoring</h3>
        <p>Track your sleep patterns, including bedtime, wake-up time, and sleep quality.</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Water Intake</h3>
        <p>Monitor your fluid intake by recording the type, quantity, and time of consumption.</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">BMI Calculation</h3>
        <p>Calculate your Body Mass Index (BMI) to assess your body weight relative to your height.</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Streak Tracking</h3>
        <p>Calculate your training streak.</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Recommendations</h3>
        <p>Find exercises and meals among our suggestions.</p>
      </div>
    </div>

    <p>For all these features, Vue Trainer provides CRUD operations, along with user authentication through login and sign-up functionalities.</p>

    <p>Join Vue Trainer today and embark on your journey towards a healthier lifestyle!</p>

    <!-- New section about the author -->
    <div class="author-info">
      <h3 class="feature-title" style="color: blue;">About the Author</h3>
      <p><b>Name:</b> Antonio Labinjan</p>
      <p><b>Occupation:</b> 2nd-year student of Computer Science at the Faculty of Informatics in Pula</p>
      <p><b>Mentor:</b> Nikola Tanković</p>
      <p><b>Course:</b> Software Engineering</p>
      <p><b>Academic Year:</b> 2023/24</p>
      <p><b>GitHub:</b> <a href="https://github.com/AntonioLabinjan" target="_blank">github.com/AntonioLabinjan</a></p>
      <p><b>Contact:</b></p>
      <p>   <b> Personal email:</b> alabinjan6@gmail.com</p>
      <p>   <b> Official email:</b> alabinjan@unipu.hr</p>
      <p>   <b> Phone:</b> 0919135146</p>
    </div>

    <!-- Button to go back home -->
    <button @click="goToExerciseSuggestions">Go to Exercise suggestions</button>
    <button @click="goToMealSuggestions">Go to Meal suggestions</button>
    <hr>
    <button @click="goBackHome">Go Back Home</button>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      darkMode: false,
    };
  },
  methods: {
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToExerciseSuggestions() {
      this.$router.push({ path: '/default-exercises' });
    },
    goToMealSuggestions() {
      this.$router.push({ path: '/default-meals' });
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
  }
};
</script>

<style scoped>
.about.dark-mode {
  background-color: #000;
  color: #fff;
}

.about {
  margin: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
}

p {
  color: #555;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature {
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.feature h3 {
  color: #007bff;
  margin-bottom: 10px;
}

.feature p {
  color: #666;
}

.author-info {
  margin-top: 30px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
}

button {
  background-color: #007bff;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
