<template>
    <div id="app">
      <h1>Skener</h1>
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
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import jsQR from 'jsqr';
  
  export default {
    setup() {
      const video = ref(null);
      const canvas = ref(null);
      const scannedData = ref(null);
      const cameraAvailable = ref(true);
  
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // Postavljanje facingMode na 'environment' za zadnju kameru
          });
          video.value.srcObject = stream;
        } catch (err) {
          console.error('Nije moguće pristupiti kameri:', err);
          cameraAvailable.value = false;
        }
      };
  
      const scanQRCode = () => {
        const context = canvas.value.getContext('2d');
        context.drawImage(video.value, 0, 0, 300, 200);
        const imageData = context.getImageData(0, 0, 300, 200);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          scannedData.value = code.data;
        } else {
          requestAnimationFrame(scanQRCode);
        }
      };
  
      const openScannedLink = () => {
        if (scannedData.value.startsWith('http')) {
          window.open(scannedData.value, '_blank');
        } else {
          alert('Skenirani sadržaj nije valjan URL.');
        }
      };
  
      onMounted(() => {
        startCamera();
        if (video.value) {
          video.value.addEventListener('loadedmetadata', () => {
            canvas.value.width = video.value.videoWidth;
            canvas.value.height = video.value.videoHeight;
            requestAnimationFrame(scanQRCode);
          });
        }
      });
  
      return { video, canvas, scannedData, cameraAvailable, openScannedLink };
    },
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
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
