
/* eslint-disable */
<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>QR-code scanner</h1>
    <nav>
      <ul class="navbar">
        <li><button @click="goToImageGallery" class="metallic-button">Image Gallery</button></li>
        <li><button @click="goToVueTrainer" class="metallic-button">Training App</button></li>
        <li><button @click="goToMealTracker" class="metallic-button">Meal Tracker</button></li>
        <li><button @click="goToSleepTracker" class="metallic-button">Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake" class="metallic-button">Water Intake Tracker</button></li>
        <li><button @click="goToBMI" class="metallic-button">BMI Calculator</button></li>
        <li><button @click="goToStreak" class="metallic-button">Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer" class="metallic-button">Music Player</button></li>
        <li><button @click="goBackHome" class="metallic-button">Go back home</button></li>
      </ul>
    </nav>
    <button @click="toggleDarkMode" class="metallic-button">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    <div v-if="!cameraAvailable">
      <p>Kamera nije dostupna na ovom uređaju.</p>
    </div>
    <div v-else>
      <video ref="video" width="300" height="200" autoplay></video>
      <canvas ref="canvas" width="300" height="200" style="display: none;"></canvas>
      <div v-if="scannedData" class="result">
        <p>Skenirani sadržaj:</p>
        <p>{{ scannedData }}</p>
        <button @click="openScannedLink" class="metallic-button">Otvori link</button>
      </div>
    </div>
  </div>
  <user-bar></user-bar>
</template>

<script>
import jsQR from 'jsqr';

export default {
  data() {
    return {
      darkMode: false,
      scannedData: null,
      cameraAvailable: true
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        this.$refs.video.srcObject = stream;
      } catch (err) {
        console.error('Nije moguće pristupiti kameri:', err);
        this.cameraAvailable = false;
      }
    },
    scanQRCode() {
      if (!this.$refs.video || !this.$refs.canvas) {
        return;
      }
      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.video, 0, 0, 300, 200);
      const imageData = context.getImageData(0, 0, 300, 200);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        this.scannedData = code.data;
      } else {
        requestAnimationFrame(this.scanQRCode);
      }
    },
    openScannedLink() {
      if (this.scannedData.startsWith('http')) {
        window.open(this.scannedData, '_blank');
      } else {
        alert('Skenirani sadržaj nije valjan URL.');
      }
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
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToMusicPlayer(){
      this.$router.push({path: '/music'});
    },
  },
  mounted() {
    this.startCamera();
    if (this.$refs.video) {
      this.$refs.video.addEventListener('loadedmetadata', () => {
        this.$refs.canvas.width = this.$refs.video.videoWidth;
        this.$refs.canvas.height = this.$refs.video.videoHeight;
        requestAnimationFrame(this.scanQRCode);
      });
    }
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}

.container {
  margin: 20px auto;
}

video {
  border: 2px solid #333;
  border-radius: 5px;
}

.result {
  margin-top: 20px;
}

.navbar {
  margin-top: 20px;
  list-style-type: none;
  padding: 0;
}

.navbar li {
  display: inline;
}

.metallic-button {
  background: linear-gradient(145deg, #d4d4d4, #ffffff);
  border: 1px solid #ccc;
  color: #000;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s, box-shadow 0.3s;
  cursor: pointer;
  margin-right: 10px;
}

.metallic-button:hover {
  background: linear-gradient(145deg, #ffffff, #d4d4d4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode {
  background-color: #000;
  color: #fff;
}

</style>
