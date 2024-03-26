<template>
  <div>
    <h1>Progress Tracker</h1>
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToVueTrainer">Go to Training App</button></li>
        <li><button @click="goToMealTracker">Go to Meal Tracker</button></li>
        <li><button @click="goToSleepTracker">Go to Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak">Go to Streak Tracker</button></li>
        <li><button @click="goBackHome">Go Back Home</button></li>
      </ul>
    </nav>
    <hr>
    <div class="container">
      <input type="file" @change="handleFileChange" accept="image/*" />
      <div class="row">
        <div v-if="filteredImages.length > 0">
          <div v-for="(image, index) in filteredImages" :key="index" class="col-md-6">
            <div class="image-container">
              <img :src="image.url" alt="Image" class="img-fluid" />
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
      </div>
      <div class="form-container">
        <label for="description">Description:</label>
        <input v-model="newImage.description" type="text" id="description" />
        <label for="weight">Weight (Kg):</label>
        <input v-model="newImage.weight" type="number" id="weight" /><br>
        <button @click="addImage" class="btn btn-primary">Add Image</button>
      </div>
      <div class="filter-container">
        <label for="weightFilter">Filter by Weight (Kg):</label>
        <input v-model="weightFilter" type="number" id="weightFilter" />
        <button @click="filterByWeight" class="btn btn-primary">Apply Filter</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
      filteredImages: [],
      newImage: {
        file: null,
        description: '',
        weight: 0,
      },
      weightFilter: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.newImage.file = file;
          this.newImage.url = reader.result;
          this.newImage.date = new Date().toLocaleString();
        };
        reader.readAsDataURL(file);
      }
    },
    addImage() {
      if (this.newImage.file) {
        this.images.push({ ...this.newImage });
        this.newImage = {
          file: null,
          description: '',
          weight: 0,
        };
        this.applyFilter();
      }
    },
    deleteImage(index) {
      this.images.splice(index, 1);
      this.applyFilter();
    },
    filterByWeight() {
      this.applyFilter();
    },
    applyFilter() {
      if (this.weightFilter) {
        const filteredWeight = parseInt(this.weightFilter);
        if (!isNaN(filteredWeight)) {
          this.filteredImages = this.images.filter(image => image.weight === filteredWeight);
          return;
        }
      }
      this.filteredImages = [...this.images];
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
  },
  created() {
    this.applyFilter();
  }
};
</script>
<style>

</style>
