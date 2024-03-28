<template>
    <div>
      <label for="training-date">Datum i vrijeme treninga:</label>
      <input type="datetime-local" id="training-date" v-model="trainingDateTime">
      
      <label for="notification-time">Vrijeme za notifikaciju (u minutama):</label>
      <input type="number" id="notification-time" v-model.number="notificationTime">
      
      <button @click="scheduleNotification">Zabilježi trening i postavi notifikaciju</button>
  
      <div v-if="countdown > 0">
        <p>Ostalo vremena do notifikacije: {{ countdown }} sekundi</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        trainingDateTime: '',
        notificationTime: 0,
        countdown: 0,
        timer: null
      };
    },
    methods: {
      scheduleNotification() {
        const trainingTime = new Date(this.trainingDateTime).getTime();
        const notificationTimeInMilliseconds = this.notificationTime * 60 * 1000;
        const notificationDateTime = new Date(trainingTime + notificationTimeInMilliseconds);
  
        const currentTime = new Date().getTime();
        const timeUntilNotification = notificationDateTime - currentTime;
        this.countdown = Math.ceil(timeUntilNotification / 1000);
  
        // Pokretanje intervalnog časovnika za odbrojavanje
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(this.timer);
            this.sendNotification();
          }
        }, 1000);
      },
      sendNotification() {
        if (Notification.permission === 'granted') {
          const notificationDateTime = new Date(this.trainingDateTime).toLocaleString();
          this.createNotification('Vrijeme za trening', `Vrijeme je za trening koji je zakazan za: ${notificationDateTime}`);
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              const notificationDateTime = new Date(this.trainingDateTime).toLocaleString();
              this.createNotification('Vrijeme za trening', `Vrijeme je za trening koji je zakazan za: ${notificationDateTime}`);
            }
          });
        }
      },
      createNotification(title, message) {
        const notification = new Notification(title, { body: message });
        // Dodali smo ovaj red kako bismo izbjegli ESLint error
        return notification;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Stiliziraj komponentu prema potrebi */
  </style>
  
