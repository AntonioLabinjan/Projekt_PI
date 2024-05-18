/* eslint-disable */
<template>
  <div :class="{ 'dark-mode': darkMode }">
    <button @click="toggleDarkMode" class="btn btn-dark">{{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</button>
    <button @click="editAsAdmin" class="btn btn-dark">Edit as admin</button>
    <button @click="goBack" class="btn btn-dark">Go Back</button>
    <h1 class="h1" :class="{'dark-mode': darkMode}">Sports Event Gallery</h1>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search events..." class="search-input">
    </div>
    <hr>
    <div v-for="(event, index) in filteredEvents" :key="index" class="event">
      <h2>{{ event.name }}</h2>
      <p><strong>Location:</strong> {{ event.location }}</p>
      <p><strong>Start Time:</strong> {{ event.startTime }}</p>
      <p><strong>Participation Fee:</strong> {{ event.fee }}</p>
      <button @click="showEventLocationOnMap(event)"class="btn btn-dark">Show Location on Map</button>
      <hr>
    </div>
        <div class="map-container" style="width: 100%; height: 400px;">
      <h4>Event map</h4>
      <iframe ref="mapFrame" width='100%' height='400px' :src="mapSrc" title="Mapa događaja" style="border:none;"></iframe>
    </div>
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
    },
    mapSrc() {
      return `https://api.mapbox.com/styles/v1/123456-a/clw6kg3ba02d001o0cxjrdlfm.html?title=false&access_token=pk.eyJ1IjoiMTIzNDU2LWEiLCJhIjoiY2x3NmtiaGNjMXB6MTJpbXVsNGUyZWd0OCJ9.7HlKhRuY3b8pQqRzXDvjtA&zoomwheel=false#5.25/43.454/12.261`;
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
    async fetchCoordinates(locationName) {
  try {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName)}.json?access_token=pk.eyJ1IjoiMTIzNDU2LWEiLCJhIjoiY2x3NmxocTIwMW1sczJrbXV5aWFha3l3aCJ9.B_bX_30NI0Wf6nISJMqlXA`);
    const data = await response.json();
    if (data && data.features && data.features.length > 0) {
      const { center } = data.features[0];
      return {
        latitude: center[1],
        longitude: center[0]
      };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
},
async showEventLocationOnMap(event) {
  try {
    let latitude, longitude;
    if (event.location && event.location.coordinates && event.location.coordinates.latitude && event.location.coordinates.longitude) {
      latitude = event.location.coordinates.latitude;
      longitude = event.location.coordinates.longitude;
    } else if (event.location) {
      const { latitude: newLatitude, longitude: newLongitude } = await this.fetchCoordinates(event.location);
      latitude = newLatitude;
      longitude = newLongitude;
    } else {
      throw new Error('Location not defined');
    }

    const mapURL = `https://api.mapbox.com/styles/v1/123456-a/clw6kg3ba02d001o0cxjrdlfm.html?title=false&access_token=pk.eyJ1IjoiMTIzNDU2LWEiLCJhIjoiY2x3NmtiaGNjMXB6MTJpbXVsNGUyZWd0OCJ9.7HlKhRuY3b8pQqRzXDvjtA&zoomwheel=false#5.25/${latitude}/${longitude}`;
    this.$refs.mapFrame.src = mapURL;
  } catch (error) {
    console.error('Error showing event location on map:', error);
  }
}

  }
};
</script>
<style scoped>

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

.btn-dark,
.btn-admin {
  background: linear-gradient(to bottom, #757575, #616161);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-dark:hover,
.btn-admin:hover {
  background: linear-gradient(to bottom, #616161, #757575);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.btn-dark:active,
.btn-admin:active {
  transform: translateY(1px);
}

</style>
