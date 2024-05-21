<template>
  <div>
    <h1>Progress Tracker</h1>
    <nav class="navbar" :class="{'dark-mode': darkMode}">
      <ul class="navbar-nav">
        <li><button class="metallic-button" @click="goToVueTrainer">Go to Training App</button></li>
        <li><button class="metallic-button" @click="goToMealTracker">Go to Meal Tracker</button></li>
        <li><button class="metallic-button" @click="goToSleepTracker">Go to Sleep Tracker</button></li>
        <li><button class="metallic-button" @click="goToWaterIntake">Go to Water Intake Tracker</button></li>
        <li><button class="metallic-button" @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button class="metallic-button" @click="goToStreak">Go to Streak Tracker</button></li>
        <li><button class="metallic-button" @click="goToMusicPlayer">Music Player</button></li>
        <li><button class="metallic-button" @click="goBackHome">Go Back Home</button></li>
      </ul>
    </nav>
    <hr>

    <div class="container" :class="{ 'dark-mode': darkMode }">
      <input type="file" @change="handleFileChange" accept="image/*" />

      <div v-if="filteredImages.length > 0" class="image-grid">
        <div v-for="(image, index) in filteredImages" :key="index" class="col-md-6">
          <div class="image-container">
            <img :src="image.url" alt="Image" class="img-fluid" @click="showImageModal(image)" />
            <div class="image-details">
              <p>{{ image.date }}</p>
              <p>{{ image.description }}</p>
              <p>{{ image.weight }} KG</p>
              <button @click="deleteImage(index)" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p>No images found for the selected weight.</p>
      </div>

      <div class="form-container">
        <label for="description">Description:</label>
        <input v-model="newImage.description" type="text" id="description" />
        <label for="weight">Weight (Kg):</label>
        <input v-model="newImage.weight" type="number" id="weight" /><br>
        <button @click="addImage" class="btn btn-primary metallic-button">Add Image</button>
      </div>

      <div v-if="selectedImage" class="image-modal">
        <span @click="selectedImage = null" class="close-btn">&times;</span>
        <img :src="selectedImage.url" alt="Full-sized Image" class="modal-image" />
      </div>

      <div class="filter-container">
        <label for="weightFilter">Filter by Weight (Kg):</label>
        <input v-model="weightFilter" type="number" id="weightFilter" />
        <button @click="filterByWeight" class="btn btn-primary metallic-button">Apply Filter</button>
      </div>

      <button @click="toggleDarkMode" class="metallic-button">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>

      <div class="weight-progress">
        <h2>Weight Progress</h2>
        <p>Initial Weight: {{ stats.initialWeight }} KG</p>
        <p>Current Weight: {{ stats.currentWeight }} KG</p>
        <p>Total Gained: {{ stats.totalGained }} KG</p>
        <p>Total Lost: {{ stats.totalLost }} KG</p>
        <p>Net Change: {{ stats.netChange }} KG</p>
        <p>Percentage Gained: {{ stats.percentageGained.toFixed(2) }}%</p>
        <p>Percentage Lost: {{ stats.percentageLost.toFixed(2) }}%</p>
      </div>
      <br>
      <br>
      <br>
      <div class="visualization-container">
        <div class="progress-bars">
          <div
            v-for="(image, index) in filteredImages"
            :key="index"
            class="progress-bar"
            :style="{ height: image.weight * 5 + 'px' }"
            @click="showImageModal(image)"
          >
            {{ image.weight }} KG
          </div>
        </div>
      </div>
      
    </div>

    <user-bar></user-bar>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      darkMode: false,
      newImage: {
        description: '',
        weight: 0,
        url: '',
        date: ''
      },
      weightFilter: null,
      selectedImage: null,
      images: [], 
      stats: {
        totalGained: 0,
        totalLost: 0,
        netChange: 0,
        initialWeight: 0,
        currentWeight: 0,
        percentageGained: 0,
        percentageLost: 0
      }
    };
  },
  computed: {
    filteredImages() {
      if (this.weightFilter) {
        const filteredWeight = parseInt(this.weightFilter);
        if (!isNaN(filteredWeight)) {
          return this.images.filter(image => image.weight === filteredWeight);
        }
      }
      return this.images;
    },
  },
  methods: {
    async loadImages() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const imageCollection = collection(getFirestore(), 'users', user.uid, 'images');
        const snapshot = await getDocs(imageCollection);
        this.images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.calculateStats();
      }
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.newImage.url = reader.result;
          this.newImage.date = new Date().toLocaleString();
        };
        reader.readAsDataURL(file);
      }
    },
    async addImage() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && this.newImage.url) {
        const { description, weight, url, date } = this.newImage;
        const docRef = await addDoc(collection(getFirestore(), 'users', user.uid, 'images'), {
          description,
          weight,
          url,
          date,
        });
        this.newImage.id = docRef.id;
        this.images.push({ ...this.newImage, id: docRef.id });
        this.resetForm();
        this.calculateStats();
      }
    },
    async deleteImage(index) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const imageToDelete = this.images[index];
        await deleteDoc(doc(getFirestore(), 'users', user.uid, 'images', imageToDelete.id));
        this.images.splice(index, 1);
        this.calculateStats();
      }
    },
    resetForm() {
      this.newImage = {
        description: '',
        weight: 0,
        url: '',
        date: ''
      };
    },
    showImageModal(image) {
      this.selectedImage = image;
    },
    goToVueTrainer() {
      this.$router.push({ path:'/vue-trainer' });
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
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToMusicPlayer() {
      this.$router.push({ path: '/music' });
    },
    calculateStats() {
      if (this.images.length === 0) {
        this.stats = {
          totalGained: 0,
          totalLost: 0,
          netChange: 0,
          initialWeight: 0,
          currentWeight: 0,
          percentageGained: 0,
          percentageLost: 0
        };
        return;
      }

      let totalGained = 0;
      let totalLost = 0;
      let initialWeight = this.images[0].weight;
      let currentWeight = this.images[this.images.length - 1].weight;

      for (let i = 1; i < this.images.length; i++) {
        let weightDiff = this.images[i].weight - this.images[i - 1].weight;
        if (weightDiff > 0) {
          totalGained += weightDiff;
        } else {
          totalLost += Math.abs(weightDiff);
        }
      }

      let netChange = currentWeight - initialWeight;
      let percentageGained = (totalGained / initialWeight) * 100;
      let percentageLost = (totalLost / initialWeight) * 100;

      this.stats = {
        totalGained,
        totalLost,
        netChange,
        initialWeight,
        currentWeight,
        percentageGained,
        percentageLost
      };
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadImages();
      } else {
        this.images = [];
      }
    });
  }
};
</script>

<style scoped>
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

.navbar.dark-mode {
  background-color: #262626; 
  color: #fff; 
}

h1 {
  color: #4CAF50; 
}

h1.dark-mode {
  color: #ffcc00; 
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4; 
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
}

button {
  background-color: #4CAF50; 
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
  margin-left: 5px;
}

button.delete {
  background-color: #DC3545; 
}

button.edit {
  background-color: #28a745; 
}

form {
  margin-top: 20px;
  background-color: #f4f4f4; 
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
  background-color: #4CAF50; 
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 3px;
}

.dark-mode {
  background-color: #333;
  color: #fff;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-fluid {
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.image-details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  color: #fff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.image-details p {
  margin: 5px 0;
}

.btn-danger {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #DC3545;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 92px;
  color: white;
  cursor: pointer;
}

.navbar .navbar-nav li button.active {
  background-color: #007bff;
}

.visualization-container {
  margin-top: 80px;
}

.progress-bars {
  display: flex;
  align-items: flex-end;
  height: 300px; 
}

.progress-bar {
  flex: 1;
  background-color: #4CAF50; 
  margin: 0 5px;
  text-align: center;
  color: #11b936;
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
  transition: height 0.3s ease; 
}

.metallic-button {
  background: linear-gradient(to bottom, #8c8c8c, #333);
  border: 1px solid #666;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  transition: 0.3s;
}

.metallic-button:hover {
  background: linear-gradient(to bottom, #333, #8c8c8c);
  border: 1px solid #999;
  transition: 0.3s;
}

.weight-progress {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.weight-progress h2 {
  text-align: center;
}

.weight-progress p {
  font-size: 16px;
  margin: 5px 0;
}
</style>
