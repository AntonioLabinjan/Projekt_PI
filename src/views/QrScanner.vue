<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1>QR-code scanner</h1>
    <nav>
      <ul class="navbar">
        <li><button @click="goToImageGallery">Image Gallery</button></li>
        <li><button @click="goToVueTrainer">Training App</button></li>
        <li><button @click="goToMealTracker">Meal Tracker</button></li>
        <li><button @click="goToSleepTracker">Sleep Tracker</button></li>
        <li><button @click="goToWaterIntake">Water Intake Tracker</button></li>
        <li><button @click="goToBMI">BMI Calculator</button></li>
        <li><button @click="goToStreak">Streak Tracker</button></li>
        <li><button @click="goToMusicPlayer">Music Player</button></li>
        <li><button @click="goBackHome">Go back home</button></li>
      </ul>
    </nav>
    <button @click="toggleDarkMode">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    <div v-if="!cameraAvailable">
      <p>Kamera nije dostupna na ovom uređaju.</p>
    </div>
    <div v-else>
      <video ref="video" width="300" height="200" autoplay></video>
      <canvas ref="canvas" width="300" height="200" style="display: none;"></canvas>
      <div v-if="scannedData" class="result">
        <p>Skenirani sadržaj:</p>
        <p>{{ scannedData }}</p>
        <button @click="openScannedLink">Otvori link</button>
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

.navbar button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
}

.navbar button:hover {
  background-color: #0056b3;
}

.container.dark-mode {
  background-color: #000;
  color: #fff;
}

</style>
