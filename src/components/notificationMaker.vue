<template>
  <div class="container">
    <label for="training-date">Training date and time:</label>
    <input type="datetime-local" id="training-date" v-model="trainingDateTime">

    <label for="notification-time">Notification time (in minutes):</label>
    <input type="number" id="notification-time" v-model.number="notificationTime">

    <button @click="scheduleNotification">Schedule training and set notification</button>

    <div v-if="countdown > 0">
      <p>Time left until notification : {{ countdown }} seconds</p>
    </div>

    <div v-for="(notification, index) in notifications" :key="index">
      <p>{{ notification.title }} - {{ notification.message }}</p>
    </div>

    <audio ref="notificationSound" src="@/assets/notification.mp3"></audio>
  </div>
</template>

<script>
import { getFirestore, doc, setDoc, getDocs, collection, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export default {
  data() {
    return {
      trainingDateTime: '',
      notificationTime: 0,
      countdown: 0,
      timer: null,
      notifications: []
    };
  },
  methods: {
    async scheduleNotification() {
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

      await this.addNotificationToFirebase();
    },
    async addNotificationToFirebase() {
      const user = auth.currentUser;
      if (user) {
        const notificationsRef = collection(db, 'notifications');
        await setDoc(doc(notificationsRef, user.uid), {
          title: 'Time for training',
          message: `It is time for your training scheduled at: ${new Date(this.trainingDateTime).toLocaleString()}`
        });
      }
    },
    async fetchNotifications() {
      const user = auth.currentUser;
      if (user) {
        const notificationsRef = collection(db, 'notifications');
        const querySnapshot = await getDocs(notificationsRef);
        this.notifications = querySnapshot.docs.map(doc => doc.data());
      }
    },
    sendNotification() {
      if (Notification.permission === 'granted') {
        const notificationDateTime = new Date(this.trainingDateTime).toLocaleString();
        this.createNotification('Time for training', `It is time for your training scheduled at: ${notificationDateTime}`);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            const notificationDateTime = new Date(this.trainingDateTime).toLocaleString();
            this.createNotification('Time for training', `It is time for your training scheduled at:: ${notificationDateTime}`);
          }
        });
      }
    },
    createNotification(title, message) {
      const notification = new Notification(title, { body: message });
      this.playNotificationSound();
      return notification;
    },
    playNotificationSound() {
      const notificationSound = new Audio(require('@/assets/notification.mp3'));
      notificationSound.play().catch((error) => {
        console.error("Failed to play the audio: ", error);
      });
    }
  },
  created() {
    this.fetchNotifications();

    const user = auth.currentUser;
    if (user) {
      const notificationsRef = collection(db, 'notifications');
      onSnapshot(notificationsRef, (querySnapshot) => {
        this.notifications = querySnapshot.docs.map(doc => doc.data());
      });
    }
  }
};
</script>

<style scoped>
.container {
  font-family: 'Arial', sans-serif;
  max-width: 500px; 
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-radius: 8px;
  background-color: #fff;
  display: flex; 
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

input[type="datetime-local"],
input[type="number"] {
  width: 100%; 
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; 
}

button {
  background-color: #00ff48;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

p {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

audio {
  display: none;
}
</style>
