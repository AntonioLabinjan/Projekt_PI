<template>
  <div class="about container" :class="{ 'dark-mode': darkMode }">
    <h2>About TrainingMate 2.0</h2>
    <hr>
    <p>Welcome to <b>TrainingMate 2.0</b>, your ultimate fitness companion!</p>
    <p>With this app, you can easily track your progress in various aspects of your health and fitness journey:</p>
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
      <div class="feature">
        <h3 class="feature-title">Music player</h3>
        <p>Add and play your favourite music</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Motivate yourself with quotes</h3>
        <p>Get variety of quotes to improve your motivation</p>
      </div>
      <div class="feature">
        <h3 class="feature-title">Enable yourself to train persistently</h3>
        <p>Set notifications to remind you of regular training</p>
      </div> 
      <div class="feature">
        <h3 class="feature-title">Scan QR codes for cool trainings</h3>
        <p>Use our premium QR codes to find various fitness videos</p>
      </div>
      <div class="feature">
        <h3 class="feature-title"> Join competitions</h3>
        <p>Find various sports competitions and conquer them</p>
      </div>
      <div class="feature">
        <h3 class="feature-title"> Chat </h3>
        <p>Chat with other users</p>
      </div>
    </div>

    <p>For all these features, TrainingMate 2.0 provides CRUD operations, along with user authentication through login and sign-up functionalities.</p>

    <p>Join TraingMate 2.0 today and embark on your journey towards a healthier lifestyle!</p>


    <div class="author-info">
    <h3 class="feature-title" style="color: blue;">About the Author</h3>
    <p><b>Name:</b> Antonio Labinjan</p>
    <p><b>Occupation:</b> 2nd-year student of Computer Science at the Faculty of Informatics in Pula</p>
    <p><b>Mentor:</b> Nikola Tanković</p>
    <p><b>Course:</b> Software Engineering</p>
    <p><b>Academic Year:</b> 2023/24</p>
    <p><b>GitHub:</b> <a href="https://github.com/AntonioLabinjan" target="_blank">github.com/AntonioLabinjan</a></p>
    <p><b>Contact:</b></p>
    <p>
        <b> Personal email:</b> alabinjan6@gmail.com 
        <button @click="openGmail('alabinjan6@gmail.com')">Email</button>
    </p>
    <p>
        <b> Official email:</b> alabinjan@unipu.hr 
        <button @click="openGmail('alabinjan@unipu.hr')">Email</button>
    </p>
    <p><b> Phone:</b> 0919135146</p>
</div>

    <button @click="goToExerciseSuggestions">Go to Exercise suggestions</button>
    <button @click="goToMealSuggestions">Go to Meal suggestions</button>
    <button @click="goToEvents">Go to Sport events</button>
    <hr>
    <div>
    <map-frame></map-frame>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <button @click="goBackHome">Go Back Home</button>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      darkMode: false,
      email1: 'alabinjan6@gmail.com',
      email2: 'alabinjan@unipu.hr'
    };
  },
  methods: {
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToExerciseSuggestions() {
      this.$router.push({ path: '/NA-exercises' });
    },
    goToMealSuggestions() {
      this.$router.push({ path: '/NA-meals' });
    },
    goToEvents(){
      this.$router.push({ path: '/sport-events'});
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    openGmail(email) {
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank')
  },
}
};
</script>

<style scoped>
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
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
  color: #4CAF50;
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
  background-color: #4CAF50;
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

.dark-mode {
  background-color: #222; 
}

.dark-mode h2,
.dark-mode p,
.dark-mode .feature h3,
.dark-mode .feature p,
.dark-mode .author-info p {
  color: #fff; 
}

.dark-mode .feature {
  background-color: #333;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);
}

.dark-mode .feature:hover {
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
}

.dark-mode .feature h3 {
  color: #6ab0ff;
}

.dark-mode .feature p {
  color: #bbb;
}

.dark-mode .author-info {
  border-color: #888;
}

.dark-mode button {
  background-color: #eee;
  color: #333;
}

.dark-mode button:hover {
  background-color: #ddd;
}


.container {
  position: relative; 
}

.container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom right, #4CAF50, #2196F3);
  opacity: 0.3; 
  pointer-events: none; 
}

.container.dark-mode {
  background-color: #262626;
  color: #fff;
}

.container {
  background-color: #f4f4f4;
}

.highlight {
  color: #4CAF50;
}

.login-signup-buttons button,
.navbar button,
.about-button button,
.caloric-balance button,
.motivational-quote button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease; 
}

.login-signup-buttons button:hover,
.navbar button:hover,
.about-button button:hover,
.caloric-balance button:hover,
.motivational-quote button:hover {
  background-color: #45a049;
  transform: scale(1.05); 
}

.header {
  position: relative; 
  z-index: 1; 
}

.header h1 {
  margin-top: 0;
  font-size: 2.5em; 
  text-transform: uppercase; 
}

.header h4 {
  font-size: 1.2em; 
}

.motivational-quote {
  position: relative; 
  z-index: 1; 
}

.motivational-quote p {
  font-style: italic;
  margin-top: 20px;
}

.motivational-quote button {
  font-weight: bold; 
  border: 2px solid #4CAF50; 
}

.motivational-quote button:hover {
  background-color: #4CAF50; 
}

.caloric-balance p {
  font-weight: bold;
}   

.map-frame {
  margin-top: 20px; 
  position: relative; 
  z-index: 0; 
}

.button-container {
  position: relative;
  z-index: 1; 
}

.about {
  position: relative;
  padding-bottom: 20px; 
}

button {
  margin-top: 20px; 
}


</style>
