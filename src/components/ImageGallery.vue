<template>
  <div>
    <h1>Progress Tracker</h1>
    <nav class="navbar" :class="{'dark-mode': darkMode}">
      <ul class="navbar-nav">
        <li><button @click="goToVueTrainer">Go to Training App</button></li>
        <li><button @click="goToMealTracker">Go to Meal Tracker</button></li>
        <li><button @click="goToSleepTracker">Go to Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak">Go to Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer">Music Player</button></li>
        <li><button @click="goBackHome">Go Back Home</button></li>
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
        <button @click="addImage" class="btn btn-primary">Add Image</button>
      </div>

      <div v-if="selectedImage" class="image-modal">
        <span @click="selectedImage = null" class="close-btn">&times;</span>
        <img :src="selectedImage.url" alt="Full-sized Image" class="modal-image" />
      </div>

      <div class="filter-container">
        <label for="weightFilter">Filter by Weight (Kg):</label>
        <input v-model="weightFilter" type="number" id="weightFilter" />
        <button @click="filterByWeight" class="btn btn-primary">Apply Filter</button>
      </div>

      <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    </div>
    
    <user-bar></user-bar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getFirestore, collection, addDoc, deleteDoc, query, where, getDocs, doc } from 'firebase/firestore';

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
    };
  },
  computed: {
    ...mapState(['images']),

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
  const imageCollection = collection(this.$db, 'images');
  const snapshot = await getDocs(imageCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });
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
  if (this.newImage.url) {
    const { description, weight, url, date } = this.newImage;
    const docRef = await addDoc(collection(this.$db, 'images'), {
      description,
      weight,
      url,
      date,
    });
    
    this.newImage.id = docRef.id;

    this.images.push(this.newImage);

    this.newImage = {
      description: '',
      weight: 0,
      url: '',
      date: '',
    };
  }
},
async deleteImage(index) {
  const imageToDelete = this.images[index];
  const imageRef = collection(this.$db, 'images');

  await deleteDoc(doc(imageRef, imageToDelete.id));
  this.images.splice(index, 1);
},

    filterByWeight() {
      // ovo već iman u computed
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
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
    },
    showImageModal(image) {
      this.selectedImage = image;
    },
  },
  async mounted() {
  const db = getFirestore();
  this.$db = db;

  try {
    const images = await this.loadImages();
    this.$store.commit('setImages', images);
  } catch (error) {
    console.error('Error loading images:', error);
  }
},

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
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.navbar .navbar-nav li button.active {
  background-color: #007bff;
}



</style>
