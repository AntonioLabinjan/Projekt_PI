<template>
  <keep-alive>
    <div>
    <div class="container" :class="{ 'dark-mode': darkMode }">
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

      <div class="selected-dates">
        <div v-for="(date, index) in selectedDates" :key="index">
          <span>{{ formatDate(date) }}</span>
          <button @click="removeDate(index)">Remove</button>
        </div>
      </div>

      <div class="streak">
        <p>Current streak: {{ currentStreak }}</p>
        <p>Record streak: {{ recordStreak }}</p>
        <div v-if="currentStreak >= 3 && currentStreak % 3 === 0" class="reward bounce-animation">
          <p>Congratulations! You've earned 3-day streak award!</p>
          <img src="@/assets/silver_medal.jpg" alt="Streak Master Badge" @click="handleAwardClick">
        </div>
        <div v-if="currentStreak >= 7 && currentStreak % 7 === 0" class="reward bounce-animation">
          <p>Congratulations! You've earned 7-day streak award!</p>
          <img src="@/assets/medal.jpg" alt="Streak Master Badge" @click="handleAwardClick2">
        </div>
      </div>

      <div class="medal-counter">
        <p>Medal Counter: {{ medalCounter }}</p>
      </div>
      <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    </div>
    <user-bar></user-bar>
    </div>
  </keep-alive>
</template>

<script>
import { db } from '@/firebase';
import { collection, addDoc, getDoc, /*updateDoc,*/ doc, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase'; 
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapActions(['incrementMedalCounter', 'otherActions']),
    ...mapState(['currentStreak', 'recordStreak', 'medalCounter', 'selectedDates'])
  },
  data() {
    return {
      darkMode: false,
    customDate: null,
    userId: null,
    };
  },
  created() {
    this.initAuthWatcher();
    this.fetchData();
  },
  methods: {
    handleAwardClick() {
    this.playCheer();
    this.incrementCounter();
  },
    handleAwardClick2(){
      this.playGoldenCheer();
      this.incrementCounter();
    },
    incrementCounter() {
    this.$store.dispatch('incrementMedalCounter');
  },
    initAuthWatcher() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userId = user.uid;
          this.fetchData();
        } else {
          this.userId = null;
          this.resetData();
        }
      });
    },
    ...mapActions(['updateStreak', 'updateMedals', 'updateSelectedDates']),
    resetData() {
      this.selectedDates = [];
      this.currentStreak = 0;
      this.recordStreak = 0;
      this.medalCounter = 0;
    },
    async fetchData() {
  if (!this.userId) return;
  
  const streaksRef = doc(db, 'users', this.userId, 'streaks', 'userStreaks');
  const streakData = await getDoc(streaksRef);
  if (streakData.exists()) {
    const data = streakData.data();
    this.$store.dispatch('setInitialData', {
      currentStreak: data.currentStreak || 0,
      recordStreak: data.recordStreak || 0,
      medalCounter: data.medalCounter || 0,
      selectedDates: data.selectedDates || []
    });
  }

  const datesRef = collection(db, 'users', this.userId, 'trainingDates');
  const queryRef = query(datesRef, orderBy('trainingDate', 'asc'));
  const dateDocs = await getDocs(queryRef);
  this.$store.dispatch('updateSelectedDates', dateDocs.docs.map(doc => doc.data().trainingDate.toDate()));
},

    fetchStreakData() {
      const streaksRef = doc(db, 'users', this.userId, 'streaks', 'userStreaks');
      getDoc(streaksRef).then(docSnap => {
        if (docSnap.exists()) {
          const { currentStreak, recordStreak, medalCounter } = docSnap.data();
          this.currentStreak = currentStreak;
          this.recordStreak = recordStreak;
          this.medalCounter = medalCounter;
        }
      }).catch(error => {
        console.error("Error fetching streak data:", error);
      });
    },
    fetchDates() {
  if (!this.userId) return;
  const datesRef = collection(db, 'users', this.userId, 'trainingDates');
  
  const queryRef = query(datesRef, orderBy('trainingDate', 'asc'));
  
  getDocs(queryRef).then(querySnapshot => {
    this.selectedDates = querySnapshot.docs.map(doc => doc.data().trainingDate.toDate());
  }).catch(error => {
    console.error("Error fetching training dates:", error);
  });
},
    formatDate(dateString) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    addCustomDate() {
      if (!this.userId || !this.customDate) return;
      const datesRef = collection(db, 'users', this.userId, 'trainingDates');
      const newDate = new Date(this.customDate);
      addDoc(datesRef, { trainingDate: new Date(newDate.setHours(0, 0, 0, 0)) })
        .then(() => {
          this.selectedDates.push(newDate);
          this.updateStreak();
          this.customDate = '';
        })
        .catch(error => {
          console.error('Error adding training date:', error);
        });
    },
    removeDate(index) {
      if (!this.userId) return;
      const dateToRemove = this.selectedDates[index];
      //const dateToRemoveISO = dateToRemove.toISOString().slice(0, 10);
      const datesRef = collection(db, 'users', this.userId, 'trainingDates');
      const q = query(datesRef, where('trainingDate', '==', dateToRemove));
      getDocs(q).then(snapshot => {
        snapshot.forEach(doc => {
          deleteDoc(doc.ref).then(() => {
            this.selectedDates.splice(index, 1);
            this.updateStreak();
          }).catch(error => {
            console.error('Error removing training date:', error);
          });
        });
      });
    },
    async updateStreak() {
  if (this.selectedDates.length === 0) {
    this.$store.dispatch('updateCurrentStreak', 0);
    this.$store.dispatch('updateRecordStreak', this.recordStreak);
    return;
  }

  const sortedDates = [...this.selectedDates].sort((a, b) => a - b);
  let currentStreak = 1;
  let maxStreak = 0;
  let lastDate = sortedDates[0];

  sortedDates.forEach((date, index) => {
    if (index === 0) return; 

    const currentDate = new Date(date);
    const previousDate = new Date(lastDate);
    const diffTime = Math.abs(currentDate - previousDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
    } else {
      currentStreak = 1; 
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }

    lastDate = date; // Update lastDate for the next iteration
  });

  const newRecordStreak = Math.max(this.recordStreak, maxStreak);
  this.$store.dispatch('updateCurrentStreak', currentStreak);
  this.$store.dispatch('updateRecordStreak', newRecordStreak);

  // Check and update medal counter if streak criteria are met
  if ((currentStreak % 3 === 0 || currentStreak % 7 === 0) && currentStreak !== this.currentStreak) {
    this.$store.dispatch('updateMedalCounter', this.medalCounter + 1);
  }
},

    toggleDarkMode() {
      var element = document.body;
      this.darkMode = !this.darkMode;
      element.classList.toggle('dark-mode', this.darkMode);
    },
    playCheer() {
      const cheerSound = new Audio(require('@/assets/cheer.mp3'));
      cheerSound.play().catch((error) => {
        console.error("Failed to play the audio:", error);
      });
    },
    playGoldenCheer() {
      const goldenCheer = new Audio(require('@/assets/golden_medal.mp3'));
      goldenCheer.play().catch((error) => {
        console.error("Failed to play the audio:", error);
      });
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
    goToSleepTracker() {
      this.$router.push({ path: '/sleep-tracker' });
    },
    goToWaterIntake() {
      this.$router.push({ path: '/water-intake' });
    },
    goToBMI() {
      this.$router.push({ path: '/BMI-calculator' });
    },
    goToMusicPlayer() {
      this.$router.push({ path: '/music' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
  },
  watch: {
  userId(newUserId, oldUserId) {
    if (newUserId && newUserId !== oldUserId) {
      this.fetchData();  
    } else if (!newUserId) {
      this.resetData();
    }
  }
}
};
</script>

<style scoped>
.workout-tracker {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f4f4f4;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.navbar li button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.navbar li button:hover {
  background-color: #45a049;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 2px solid #ddd;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

form label {
  margin-right: 10px;
}

form input[type="date"] {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

form button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #0056b3;
}

.selected-dates {
  margin-bottom: 20px;
}

.selected-dates div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #e9e9e9;
  margin-bottom: 10px;
}

.selected-dates div button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.selected-dates div button:hover {
  background-color: #d32f2f;
}

.streak {
  text-align: center;
  margin-bottom: 20px;
}

.reward {
  background-color: #ffeb3b;
  color: #333;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.medal-counter {
  text-align: center;
  margin-bottom: 20px;
}

.medal-counter p {
  font-size: 24px;
  color: #333;
}

.dark-mode {
  background-color: black;
  color: white;
}

.dark-mode .exercise-input-section label,
.dark-mode .exercise-input-section input,
.dark-mode .edit-form label,
.dark-mode .edit-form input,
.dark-mode .filter-container label,
.dark-mode .statistics strong {
  color: #fff; 
}

.dark-mode .navbar {
  background-color: #333; 
}

.dark-mode .btn-secondary,
.dark-mode .btn-primary {
  background-color: #444; 
  color: #fff; 
  border-color: #555; 
}

.dark-mode h1{
  color: #fff
}

.dark-mode .medal-counter p {
  font-size: 24px;
  color: #fff;
}

.dark-mode .selected-dates div {
  display: center;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  background-color: black;
  margin-bottom: 10px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.reward.bounce-animation {
  animation: bounce 2s ease-in-out;
  animation-fill-mode: both;
}

.reward.playing-animation {
  animation: none;
}

</style>
