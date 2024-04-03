<template>
  <div class="workout-tracker">
    <nav class="navbar">
      <ul>
        <li><button @click="goToImageGallery">Go to Image Gallery</button></li>
        <li><button @click="goToVueTrainer">Go to Training App</button></li>
        <li><button @click="goToMealTracker">Go to Meal Tracker</button></li>
        <li><button @click="goToSleepTracker">Go to Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goToMusicPlayer">Music Player</button></li>
        <li><button @click="goBackHome">Go Back Home</button></li>
      </ul>
    </nav>
    <hr>

    <h1>Training Streak Tracker</h1>
    <form @submit.prevent="addCustomDate">
      <label for="customDate">Add your date:</label>
      <input type="date" id="customDate" v-model="customDate">
      <button type="submit">Add</button>
    </form>

    <vue-calendar @dateSelected="addDate"></vue-calendar>

    <div class="selected-dates">
      <div v-for="(date, index) in selectedDates" :key="index">
        <span>{{ formatDate(date) }}</span>
        <button @click="removeDate(index)">Remove</button>
      </div>
    </div>

    <div class="streak">
      <p>Current streak: {{ currentStreak }}</p>
      <p>Record streak: {{ recordStreak }}</p>
      <div v-if="currentStreak >= 3 && currentStreak%3==0" class="reward">
        <p>Congratulations! You've earned 3-day streak award!</p>
        <img src="@/assets/silver_medal.jpg" alt="Streak Master Badge">
      </div>
      <div v-if="currentStreak >=7 && currentStreak%7==0" class="reward">
        <p>Congratulations! You've earned 7-day streak award!</p>
        <img src="@/assets/medal.jpg" alt="Streak Master Badge">
      </div>
    </div>

    <div class="medal-counter">
      <p>Medal Counter: {{ medalCounter }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDates: [], // Odabrani datumi
      currentStreak: 0, // Trenutni streak
      recordStreak: 0, // Rekordni streak
      customDate: '', // Datum koji korisnik unosi ručno
      medalCounter: 0, // Brojač medalja
      prevStreak: 0 // Prethodni streak
    };
  },
  methods: {
    // Funkcije za navigaciju
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToVueTrainer() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
    },
    goToSleepTracker() {
      this.$router.push({ path: '/sleep-tracker' });
    },
    goToWaterIntake() {
      this.$router.push({ path: '/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator' });
    },
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
    },
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    // datum koji je korisnik unio ručno
    addCustomDate() {
      if (this.customDate) {
        this.selectedDates.push(this.customDate);
        this.updateStreak();
        this.customDate = ''; 
      }
    },
    // datum iz kalendara
    addDate(date) {
      this.selectedDates.push(date);
      this.updateStreak();
    },
    removeDate(index) {
      this.selectedDates.splice(index, 1);
      this.updateStreak();
    },
updateStreak() {
  if (this.selectedDates.length === 0) {
    this.currentStreak = 0;
    this.recordStreak = 0;
    this.medalCounter = 0;
    this.prevStreak = 0;
    return;
  }

  let streak = 1;
  for (let i = 1; i < this.selectedDates.length; i++) {
    const prevDate = new Date(this.selectedDates[i - 1]);
    const currentDate = new Date(this.selectedDates[i]);
    const prevTime = prevDate.getTime();
    const currentTime = currentDate.getTime();
    const oneDay = 1000 * 60 * 60 * 24;

    if ((currentTime - prevTime) / oneDay === 1) {
      streak++;
    } else {
      streak = 1; // resetiramo streak ako se prekine
    }
  }

  if ((streak % 3 === 0 || streak % 7 === 0) && streak !== 0) { // tu su uvjeti za dobit medalju
    this.medalCounter++;
  }

  this.currentStreak = streak;
  this.recordStreak = Math.max(this.recordStreak, streak);
  this.prevStreak = streak;

  this.updateReward();
},


// Ažuriranje nagrade 
updateReward() {
},

formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

  }
};
</script>

<style scoped>
.workout-tracker {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.selected-dates {
  margin-top: 20px;
}

.selected-dates > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.selected-dates span {
  flex-grow: 1;
  margin-right: 10px;
}

.selected-dates button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.selected-dates button:hover {
  background-color: #d32f2f;
}

.streak {
  margin-top: 20px;
}

.navbar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbar ul li {
  display: inline;
  margin-right: 10px;
}

.navbar ul li button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.navbar ul li button:hover {
  background-color: #0056b3;
}

.reward {
  margin-top: 20px;
  text-align: center;
}

.reward p {
  font-size: 18px;
  margin-bottom: 10px;
}

.reward img {
  width: 100px;
  height: 100px;
}

.medal-counter {
  margin-top: 20px;
}

.medal-counter p {
  font-size: 16px;
}
</style>
