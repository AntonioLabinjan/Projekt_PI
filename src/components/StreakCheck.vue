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
        <div v-if="currentStreak >= 3 && currentStreak % 3 === 0" class="reward bounce-animation">
          <p>Congratulations! You've earned 3-day streak award!</p>
          <img src="@/assets/silver_medal.jpg" alt="Streak Master Badge" @click="playCheer">
        </div>
        <div v-if="currentStreak >= 7 && currentStreak % 7 === 0" class="reward bounce-animation">
          <p>Congratulations! You've earned 7-day streak award!</p>
          <img src="@/assets/medal.jpg" alt="Streak Master Badge" @click="playGoldenCheer">
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
import { collection, addDoc, getDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      darkMode: false,
      selectedDates: [],
      currentStreak: 0,
      recordStreak: 0,
      customDate: null,
      medalCounter: 0,
      prevStreak: 0,
      isNewMedalAdded: false
    };
  },
  methods: {
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
playGoldenCheer(){
  const goldenCheer = new Audio(require('@/assets/golden_medal.mp3'));
  goldenCheer.play().catch((error) => {
    console.error("Failed to play the audio:", error);
  });
},
playAnimation() {
    const rewardElements = document.querySelectorAll('.reward.bounce-animation');
    rewardElements.forEach(element => {
      element.classList.add('playing-animation');
      element.addEventListener('animationend', () => {
        element.classList.remove('bounce-animation', 'playing-animation');
      }, { once: true });
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

    formatDate(dateString) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    addCustomDate() {
      if (this.customDate) {
        const selectedDateExists = this.selectedDates.some(selectedDate => {
  return new Date(selectedDate).toISOString().slice(0, 10) === this.customDate;
});

        if (!selectedDateExists) {
          addDoc(collection(db, 'trainingDates'), { trainingDate: new Date(this.customDate) })
            .then(() => {
              this.selectedDates.push(new Date(this.customDate));
              this.updateStreak();
              this.customDate = ''; 
            })
            .catch(error => {
              console.error('Error adding document: ', error);
            });
        } else {
          alert('This date already exists. Please choose a different date.');
        }
      }
    },
    async fetchData() {
      try {
        const docRef = doc(db, 'streaks', 'userStreaks');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { currentStreak, recordStreak } = docSnap.data();
          this.currentStreak = currentStreak;
          this.recordStreak = recordStreak;
        } else {
          this.currentStreak = 0;
          this.recordStreak = 0;
          this.medalCounter = 0; 
        }
      } catch (error) {
        console.error('Error getting streaks document: ', error);
      }
    },
    async updateStreak() {
    this.isNewMedalAdded = false; 

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
            streak = 1;
        }
    }

    this.recordStreak = Math.max(this.recordStreak, streak);


    if ((streak % 3 === 0 || streak % 7 === 0) && streak !== 0) {
        if (!this.isNewMedalAdded) { 
            this.medalCounter++;
            this.isNewMedalAdded = true;
        }
    }

    this.currentStreak = streak;

    try {
        const docRef = doc(db, 'streaks', 'userStreaks');
        await updateDoc(docRef, {
            currentStreak: this.currentStreak,
            recordStreak: this.recordStreak,
            medalCounter: this.medalCounter
        });
    } catch (error) {
        console.error('Error updating streaks document: ', error);
    }
},


    addDate(date) {
      this.selectedDates.push(date);
      this.updateStreak();
    },
    removeDate(index) {
      console.log('Removing date at index:', index);
  const dateToRemove = this.selectedDates[index];
  console.log('Date to remove:', dateToRemove);
  const dateToRemoveISO = new Date(dateToRemove).toISOString().slice(0, 10); 

  getDocs(collection(db, 'trainingDates')).then(snapshot => {
    snapshot.forEach(doc => {
      const trainingDate = new Date(doc.data().trainingDate.seconds * 1000); 

      if (trainingDate.toISOString().slice(0, 10) === dateToRemoveISO) {

        deleteDoc(doc.ref).then(() => {
          console.log('Document successfully deleted from Firestore!');
          const indexToRemove = this.selectedDates.indexOf(dateToRemove);
if (indexToRemove !== -1) {
  this.selectedDates.splice(indexToRemove, 1);
}
          this.updateStreak();
        }).catch(error => {
          console.error('Error removing document: ', error);
        });
      }
    });
  }).catch(error => {
    console.error('Error getting documents: ', error);
  });
},

    saveDataLocally() {
      localStorage.setItem('selectedDates', JSON.stringify(this.selectedDates));
      localStorage.setItem('currentStreak', this.currentStreak);
      localStorage.setItem('recordStreak', this.recordStreak);
      localStorage.setItem('medalCounter', this.medalCounter);
      localStorage.setItem('darkMode', this.darkMode);
    },
    loadDataLocally() {
      const selectedDates = JSON.parse(localStorage.getItem('selectedDates'));
      if (selectedDates) {
        this.selectedDates = selectedDates;
      }
      const currentStreak = localStorage.getItem('currentStreak');
      if (currentStreak) {
        this.currentStreak = parseInt(currentStreak);
      }
      const recordStreak = localStorage.getItem('recordStreak');
      if (recordStreak) {
        this.recordStreak = parseInt(recordStreak);
      }
      const medalCounter = localStorage.getItem('medalCounter');
      if (medalCounter) {
        this.medalCounter = parseInt(medalCounter);
      }
      const darkMode = localStorage.getItem('darkMode');
  if (darkMode !== null) {
    this.darkMode = JSON.parse(darkMode); 
  }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData().then(() => {
        vm.updateStreak();
      });
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchData();
    next();
  },
  mounted() {
  this.loadDataLocally();
  this.toggleDarkMode();
  this.isNewMedalAdded = false; 
},
  updated() {
    this.saveDataLocally();
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
