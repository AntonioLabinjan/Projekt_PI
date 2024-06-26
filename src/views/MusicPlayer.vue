/* eslint-disable */
<template>
  <div class="music-player-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="header">
      <h1>Music Player</h1>
      <hr>
      <nav>
        <ul class="navbar">
          <li><button @click="goToImageGallery" class="metallic-button">Image Gallery</button></li>
          <li><button @click="goToVueTrainer" class="metallic-button">Training App</button></li>
          <li><button @click="goToMealTracker" class="metallic-button">Meal Tracker</button></li>
          <li><button @click="goToSleepTracker" class="metallic-button">Sleep Tracker</button></li>
          <li><button @click="goToWaterIntake" class="metallic-button">Water Intake Tracker</button></li>
          <li><button @click="goToBMI" class="metallic-button">BMI Calculator</button></li>
          <li><button @click="goToStreak" class="metallic-button">Streak Tracker</button></li>
        </ul>
      </nav>
      <button @click="toggleDarkMode" class="dark-mode-button metallic-button">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</button>
    </div>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search..." class="metallic-input">
      <button @click="search" class="metallic-button">Search</button>
    </div>
    <div v-if="filteredSongs.length === 0" class="no-results">No results.</div>
    <ul v-else class="song-list">
      <li v-for="song in filteredSongs" :key="song.id" class="song-item">
        <span>{{ song.title }} by {{ song.author }} ({{ song.genre }})</span>
        <div class="button-group">
          <button @click="play(song)" class="metallic-button">Play</button>
          <button @click="edit(song)" class="metallic-button">Edit</button>
          <button @click="deleteSong(song.id)" class="metallic-button">Delete</button>
        </div>
      </li>
    </ul>
    <button @click="showAddForm = true" class="add-button metallic-button">Add new song</button>
    <div v-if="showAddForm" class="add-form">
      <input type="text" v-model="newSong.title" placeholder="Title" class="metallic-input">
      <input type="text" v-model="newSong.author" placeholder="Author" class="metallic-input">
      <input type="text" v-model="newSong.genre" placeholder="Genre" class="metallic-input">
      <input type="text" v-model="newSong.youtubeLink" placeholder="YouTube link" class="metallic-input">
      <button @click="addSong" class="metallic-button">Add song</button>
    </div>
    <div v-if="currentSongUrl" class="video-player">
      <iframe width="560" height="315" :src="currentSongUrl" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <button @click="closeVideo" class="close-video-button metallic-button">Close</button>
    </div>
    <div v-if="showEditForm" class="edit-form">
      <input type="text" v-model="editedSong.title" placeholder="Title" class="metallic-input">
      <input type="text" v-model="editedSong.author" placeholder="Author" class="metallic-input">
      <input type="text" v-model="editedSong.genre" placeholder="Genre" class="metallic-input">
      <input type="text" v-model="editedSong.youtubeLink" placeholder="YouTube link" class="metallic-input">
      <button @click="saveEdit" class="metallic-button">Save changes</button>
    </div>
    <button @click="goBackHome" class="back-button metallic-button">Go back home</button>

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
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  data() {
    return {
      currentSongUrl: '',
      searchQuery: '',
      showAddForm: false,
      showEditForm: false,
      newSong: { title: '', author: '', genre: '', youtubeLink: '' },
      editedSong: { id: null, title: '', author: '', genre: '', youtubeLink: '' },
      isDarkMode: false,
      songs: [], 
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
    closeVideo() {
    this.currentSongUrl = '';
  },
    play(song) {
  let embedLink = song.youtubeLink.replace("watch?v=", "embed/");
  this.currentSongUrl = embedLink;
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
      const song = this.songs.find(song => song.id === id);
      if (!song) {
        console.error('Song not found!');
        return;
      }

      await deleteDoc(doc(db, 'users', user.uid, 'songs', id));

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
        this.updateGenreCount();
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
  this.genreCount = {}; 
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
  border-radius: 5px;
}

.add-form button,
.edit-form button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.back-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  cursor: pointer;
}

.video-player {
  margin: 20px auto;
  max-width: 560px;
}

.close-video-button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
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
  color: #fff;
}

.dark-mode .back-button {
  background-color: #ccc;
  color: #000;
}

.dark-mode .close-video-button {
  background-color: #e63946;
}

.metallic-button {
  background: linear-gradient(145deg, #7a7575, #ffffff);
  border: 1px solid #ccc;
  color: #000;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: background 0.3s, box-shadow 0.3s;
}

.metallic-button:hover {
  background: linear-gradient(145deg, #7a7575, #d4d4d4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.metallic-input {
  background: linear-gradient(145deg, #d4d4d4, #ffffff);
  border: 1px solid #ccc;
  color: #000;
  padding: 5px;
  border-radius: 5px;
  transition: background 0.3s, box-shadow 0.3s;
}

.metallic-input:focus {
  background: linear-gradient(145deg, #ffffff, #d4d4d4);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
