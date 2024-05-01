<template>
  <div class="music-player-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="header">
      <h1>Music Player</h1>
      <hr>
      <nav>
        <ul class="navbar">
          <li><button @click="goToImageGallery">Image Gallery</button></li>
          <li><button @click="goToVueTrainer">Training App</button></li>
          <li><button @click="goToMealTracker">Meal Tracker</button></li>
          <li><button @click="goToSleepTracker">Sleep Tracker</button></li>
          <li><button @click="goToWaterIntake">Water Intake Tracker</button></li>
          <li><button @click="goToBMI">BMI Calculator</button></li>
          <li><button @click="goToStreak">Streak Tracker</button></li>
        </ul>
      </nav>
      <button @click="toggleDarkMode" class="dark-mode-button">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</button>
    </div>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Pretraži...">
      <button @click="search">Pretraži</button>
    </div>
    <div v-if="filteredSongs.length === 0" class="no-results">Nema rezultata.</div>
    <ul v-else class="song-list">
      <li v-for="song in filteredSongs" :key="song.id" class="song-item">
        <span>{{ song.title }} by {{ song.author }} ({{ song.genre }})</span>
        <div class="button-group">
          <button @click="play(song)">Play</button>
          <button @click="edit(song)">Edit</button>
          <button @click="deleteSong(song.id)">Delete</button>
        </div>
      </li>
    </ul>
    <button @click="showAddForm = true" class="add-button">Dodaj novu pjesmu</button>
    <div v-if="showAddForm" class="add-form">
      <input type="text" v-model="newSong.title" placeholder="Naslov">
      <input type="text" v-model="newSong.author" placeholder="Autor">
      <input type="text" v-model="newSong.genre" placeholder="Žanr">
      <input type="text" v-model="newSong.youtubeLink" placeholder="YouTube link">
      <button @click="addSong">Dodaj pjesmu</button> 
    </div>
    <div v-if="showEditForm" class="edit-form">
      <input type="text" v-model="editedSong.title" placeholder="Naslov">
      <input type="text" v-model="editedSong.author" placeholder="Autor">
      <input type="text" v-model="editedSong.genre" placeholder="Žanr">
      <input type="text" v-model="editedSong.youtubeLink" placeholder="YouTube link">
      <button @click="saveEdit">Spremi promjene</button>
    </div>
    <button @click="goBackHome" class="back-button">Povratak na početnu</button>

    <div class="genre-counter">
  <h2>Genre Counter</h2>
  <div v-for="(count, genre) in genreCount" :key="genre">
    {{ genre }}: {{ count }}
  </div>
</div>

  </div>
  <user-bar></user-bar>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  data() {
    return {
      searchQuery: '',
      showAddForm: false,
      showEditForm: false,
      newSong: { title: '', author: '', genre: '', youtubeLink: '' },
      editedSong: { id: null, title: '', author: '', genre: '', youtubeLink: '' },
      isDarkMode: false,
      songs: [], // Ovo prazno polje će držati sve pjesme koje se dohvate za korisnika
      genreCount: {},
    };
  },
  computed: {
    filteredSongs() {
      return this.songs.filter(song =>
        song.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        song.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        song.genre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    goBackHome() {
      this.$router.push('/');
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
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
    play(song) {
      window.open(song.youtubeLink);
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    edit(song) {
      this.editedSong = { ...song };
      this.showEditForm = true;
    },
    async addSong() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const songData = { ...this.newSong, userId: user.uid };
        const docRef = await addDoc(collection(db, 'users', user.uid, 'songs'), songData);
        this.songs.push({ ...songData, id: docRef.id });
        this.showAddForm = false;
        this.newSong = { title: '', author: '', genre: '', youtubeLink: '' };
        if (this.genreCount[songData.genre]) {
        this.genreCount[songData.genre]++;
      } else {
        this.genreCount[songData.genre] = 1;
      }
    }
      },
    async deleteSong(id) {
    console.log('Deleting song with ID:', id);
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'songs', id));
        // Nakon uspješnog brisanja, filtrirajte songs array kako biste uklonili obrisani song
        this.songs = this.songs.filter(song => song.id !== id);
        if (this.genreCount[song.genre] && this.genreCount[song.genre] > 1) {
          this.genreCount[song.genre]--;
        } else {
          delete this.genreCount[song.genre];
        }
      } catch (error) {
        console.error('Error deleting song:', error);
      }
    }
  },
    async confirmDeleteSong(id) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid, 'songs', id));
        this.songs = this.songs.filter(song => song.id !== id);
      }
    },
    openEditDialog(song) {
      this.editedSong = { ...song };
      this.showEditForm = true;
    },
    async saveEdit() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid, 'songs', this.editedSong.id), this.editedSong);
        const index = this.songs.findIndex(song => song.id === this.editedSong.id);
        if (index !== -1) {
          this.songs[index] = this.editedSong;
        }
        this.showEditForm = false;
        this.editedSong = { id: null, title: '', author: '', genre: '', youtubeLink: '' };
      }
    },
    async fetchSongs() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'songs'));
        this.songs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.updateGenreCount();
      }
    },
    updateGenreCount() {
  this.genreCount = {}; // Resetiranje objekta
  this.songs.forEach(song => {
    if (this.genreCount[song.genre]) {
      this.genreCount[song.genre]++;
    } else {
      this.genreCount[song.genre] = 1;
    }
  });
},
  },
  mounted() {
    this.fetchSongs();
  }
};
</script>

<style>
.music-player-container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.no-results {
  text-align: center;
  margin-top: 20px;
}

.song-list {
  list-style: none;
  padding: 0;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.button-group button {
  margin-left: 10px;
}

.add-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-form,
.edit-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.add-form input,
.edit-form input {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-form button,
.edit-form button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #ccc;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.dark-mode .header,
.dark-mode .search-bar input,
.dark-mode .no-results,
.dark-mode .song-item,
.dark-mode .add-form input,
.dark-mode .edit-form input,
.dark-mode .back-button {
  color: #fff;
  background-color: #333;
}

.dark-mode .button-group button,
.dark-mode .add-form button,
.dark-mode .edit-form button {
  background-color: #007bff;
  color: #fff;
}

.dark-mode .back-button {
  background-color: #ccc;
  color: #000;
}

</style>
