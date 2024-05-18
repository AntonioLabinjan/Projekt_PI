/* eslint-disable */
<template>
    <div :class="{ 'dark-mode': darkMode }">
      <h1 class="h1" :class="{'dark-mode': darkMode}">Sports Event Gallery</h1>
      <hr>
      <div v-for="(event, index) in events" :key="index" class="event">
        <h2>{{ event.name }}</h2>
        <p><strong>Location:</strong> {{ event.location }}</p>
        <p><strong>Start Time:</strong> {{ event.startTime }}</p>
        <p><strong>Participation Fee:</strong> {{ event.fee }}</p>
        <button @click="editEvent(index)" class="btn-dark">Edit</button>
        <button @click="deleteEvent(index)" class="btn-dark">Delete</button>
        <hr>
      </div>
  
      <h2 v-if="editMode">Edit Event</h2>
      <h2 v-else>Add New Event</h2>
      <form @submit.prevent="submitEvent">
        <label>Event Name:</label>
        <input type="text" v-model="newEvent.name" required><br>
        <label>Location:</label>
        <input type="text" v-model="newEvent.location" required><br>
        <label>Start Time:</label>
        <input type="datetime-local" v-model="newEvent.startTime" required><br>
        <label>Participation Fee:</label>
        <input type="number" v-model="newEvent.fee" required><br>
        <button type="submit" v-if="editMode" class="btn-dark">Save Changes</button>
        <button type="submit" v-else class="btn-dark">Add Event</button>
        <button type="button" @click="cancelEdit" v-if="editMode" class="btn-dark">Cancel</button>
      </form>
      <event-map></event-map>
      <br>
      <br>
      <br>
      <br>
      <br>
      <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
      <button @click="goBack" class="btn-dark">Go Back</button>
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
        };
      },
      created() {
        this.fetchEvents();
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
        }
      }
    };
    </script>
    <style scoped>
    .dark-mode {
      background-color: #333;
      color: #fff;
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
    
    .btn-dark {
      background: linear-gradient(to bottom, #757575, #616161);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .btn-dark:hover {
      background: linear-gradient(to bottom, #616161, #757575);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }
    
    .btn-dark:active {
      transform: translateY(1px);
    }
    
    .btn-delete {
      background: linear-gradient(to bottom, #cc0000, #990000);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .btn-delete:hover {
      background: linear-gradient(to bottom, #990000, #cc0000);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }
    
    .btn-delete:active {
      transform: translateY(1px);
    }
    </style>
    
