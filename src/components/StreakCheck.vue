<template>
  <keep-alive>
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
        <div v-if="currentStreak >= 3 && currentStreak % 3 === 0" class="reward">
          <p>Congratulations! You've earned 3-day streak award!</p>
          <img src="@/assets/silver_medal.jpg" alt="Streak Master Badge" @click="playCheer">
        </div>
        <div v-if="currentStreak >= 7 && currentStreak % 7 === 0" class="reward">
          <p>Congratulations! You've earned 7-day streak award!</p>
          <img src="@/assets/medal.jpg" alt="Streak Master Badge" @click="playCheer">
        </div>
      </div>

      <div class="medal-counter">
        <p>Medal Counter: {{ medalCounter }}</p>
      </div>
    </div>
  </keep-alive>
</template>

<script>
import { db } from '@/firebase';
import { collection, addDoc, getDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

export default {
  data() {
    return {
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
    playCheer() {
  const cheerSound = new Audio(require('@/assets/cheer.mp3')); 
  cheerSound.play().catch((error) => {
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
    if (!this.isNewMedalAdded) { // je li već dodana nova medalja
      this.medalCounter++;
      this.isNewMedalAdded = true; // nova medalja dodana
    }
  } else {
    this.isNewMedalAdded = false; // ako nije dodana nova medalja
  }

  this.currentStreak = streak;

  try {
    const docRef = doc(db, 'streaks', 'userStreaks', 'medalCounter');
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
  },
  updated() {
    this.saveDataLocally();
  }
};
</script>
