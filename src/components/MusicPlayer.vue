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
      <button @click="addNewSong">Dodaj pjesmu</button> 
    </div>
    <div v-if="showEditForm" class="edit-form">
      <input type="text" v-model="editedSong.title" placeholder="Naslov">
      <input type="text" v-model="editedSong.author" placeholder="Autor">
      <input type="text" v-model="editedSong.genre" placeholder="Žanr">
      <input type="text" v-model="editedSong.youtubeLink" placeholder="YouTube link">
      <button @click="saveEditedSong">Spremi promjene</button>
    </div>
    <button @click="goBackHome" class="back-button">Povratak na početnu</button>

    <!-- Prikaz countera za žanrove -->
    <div class="genre-counter">
      <h2>Genre Counter</h2>
      <div v-for="(count, genre) in genreCounter" :key="genre">
        {{ genre }}: {{ count }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      searchQuery: '', 
      showAddForm: false, 
      showEditForm: false, 
      newSong: { title: '', author: '', genre: '', youtubeLink: '' }, 
      editedSong: { id: null, title: '', author: '', genre: '', youtubeLink: '' },
      isDarkMode: false,
    };
  },
  computed: {
    ...mapState(['songs', 'genreCounter']),
    filteredSongs() {
      return this.songs.filter(song =>
        song.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        song.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        song.genre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    ...mapActions(['addSong', 'editSong', 'deleteSong']),
    search() {
      // ovo mi ustvari ne treba, jer filter radi istu stvar
    },
    play(song) {
      window.open(song.youtubeLink);
    },
    edit(song) {
      this.editedSong = { ...song };
      this.showEditForm = true;
    },
    saveEditedSong() {
      const index = this.songs.findIndex(song => song.id === this.editedSong.id);
      if (index !== -1) {
        this.editSong({ index, song: { ...this.editedSong } });
        this.showEditForm = false;
        this.editedSong = { id: null, title: '', author: '', genre: '', youtubeLink: '' };
      }
    },
    deleteSong(id) {
      const song = this.songs.find(song => song.id === id);
      if (song) {
        this.$store.commit('deleteSong', id);
        this.$store.commit('decrementGenreCounter', song.genre);
      }
    },
    addNewSong() { 
      this.newSong.id = this.songs.length + 1;
      this.addSong({ ...this.newSong });
      this.$store.commit('incrementGenreCounter', this.newSong.genre);
      this.showAddForm = false;
      this.newSong = { title: '', author: '', genre: '', youtubeLink: '' };
    },
    goBackHome(){
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
    goToLogIn() {
      this.$router.push({ path: '/login' });
    },
    goToSignUp() {
      this.$router.push({ path: '/sign-up' });
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
    goToAbout() {
      this.$router.push({ path: '/about' });
    },
    goToStreak() {
      this.$router.push({ path: '/streak' });
    },
    goToScanner() {
      this.$router.push({ path: '/qr-scanner'});
    }
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
