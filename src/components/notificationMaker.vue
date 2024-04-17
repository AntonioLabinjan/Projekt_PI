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

    <div v-for="(notification, index) in notifications" :key="index">
      <p>{{ notification.title }} - {{ notification.message }}</p>
    </div>

    <audio ref="notificationSound" src="@/assets/notification.mp3"></audio>
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
  computed: {
    notifications() {
      return this.$store.state.notifications; 
    }
  },
  methods: {
    scheduleNotification() {
      const trainingTime = new Date(this.trainingDateTime).getTime();
      const notificationTimeInMilliseconds = this.notificationTime * 60 * 1000;
      const notificationDateTime = new Date(trainingTime + notificationTimeInMilliseconds);

      const currentTime = new Date().getTime();
      const timeUntilNotification = notificationDateTime - currentTime;
      this.countdown = Math.ceil(timeUntilNotification / 1000);

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
      this.$store.commit('addNotification', {
        title: title,
        message: message
      });

      const notification = new Notification(title, { body: message });
      this.playNotificationSound(); 
      return notification;
    },
    playNotificationSound() {
      const notificationSound = new Audio(require('@/assets/notification.mp3'));
      notificationSound.play().catch((error) => {
        console.error("Failed to play the audio: ", error);
      });
    },

    playLionRoar() {
  const roarSound = new Audio(require('@/assets/roar.mp3')); 
  roarSound.play().catch((error) => {
    console.error("Failed to play the audio:", error);
  });
},
  }
};
</script>

<style scoped>
</style>
