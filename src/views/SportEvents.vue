<template>
  <div :class="{ 'dark-mode': darkMode }">
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    <button @click="editAsAdmin">Edit as admin</button>
    <button @click="goBack">Go Back</button>
    <h1 class="h1" :class="{'dark-mode': darkMode}">Sports Event Gallery</h1>
    <!-- Search bar -->
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search events..." class="search-input">
    </div>
    <hr>
    <div v-for="(event, index) in filteredEvents" :key="index" class="event">
      <h2>{{ event.name }}</h2>
      <p><strong>Location:</strong> {{ event.location }}</p>
      <p><strong>Start Time:</strong> {{ event.startTime }}</p>
      <p><strong>Participation Fee:</strong> {{ event.fee }}</p>
      <hr>
    </div>
    <event-map></event-map>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      events: [],
      newEvent: {
        name: '',
        location: '',
        startTime: '',
        fee: 0
      },
      editIndex: null,
      editMode: false,
      darkMode: false,
      searchQuery: ''
    };
  },
  created() {
    this.fetchEvents();
  },
  computed: {
    filteredEvents() {
      return this.events.filter(event =>
      event.location.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
event.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
event.fee.toString() === this.searchQuery.toString()

      );
    }
  },
  methods: {
    async fetchEvents() {
      const querySnapshot = await getDocs(collection(db, "sportsEvents"));
      this.events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async addEvent() {
      await addDoc(collection(db, "sportsEvents"), this.newEvent);
      this.fetchEvents();
      this.resetForm();
    },
    editEvent(index) {
      this.editIndex = index;
      this.newEvent = { ...this.events[index] };
      this.editMode = true;
    },
    async updateEvent() {
      const eventId = this.events[this.editIndex].id;
      await updateDoc(doc(db, "sportsEvents", eventId), this.newEvent);
      this.fetchEvents();
      this.resetForm();
    },
    async deleteEvent(index) {
      const eventId = this.events[index].id;
      await deleteDoc(doc(db, "sportsEvents", eventId));
      this.fetchEvents();
    },
    submitEvent() {
      if (this.editMode) {
        this.updateEvent();
      } else {
        this.addEvent();
      }
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.newEvent = {
        name: '',
        location: '',
        startTime: '',
        fee: 0
      };
      this.editIndex = null;
      this.editMode = false;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    goBack(){
      this.$router.push('/about');
    },
    editAsAdmin(){
      this.$router.push({ path: '/admin-login', query: { redirect: '/admin-events'} });
    },
  }
};
</script>

<style scoped>
/* Add your scoped styles here */
.dark-mode {
  background-color: #333;
  color: #fff;
}

.search-bar {
  width: 100%;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
}

.event {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.event h2 {
  margin-top: 0;
}

.event p {
  margin-bottom: 5px;
}
</style>