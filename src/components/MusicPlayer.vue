<template>
    <div>
        <div>
            <h1>Music player</h1>
        </div>
      <div>
        <input type="text" v-model="searchQuery" placeholder="Pretraži...">
        <button @click="search">Pretraži</button>
      </div>
      <div v-if="filteredSongs.length === 0">Nema rezultata.</div>
      <ul v-else>
        <li v-for="song in filteredSongs" :key="song.id">
          <span>{{ song.title }} by {{ song.author }} ({{ song.genre }})</span>
          <button @click="play(song)">Play</button>
          <button @click="edit(song)">Edit</button>
          <button @click="deleteSong(song.id)">Delete</button>
        </li>
      </ul>
      <button @click="showAddForm = true">Dodaj novu pjesmu</button>
      <div v-if="showAddForm">
        <input type="text" v-model="newSong.title" placeholder="Naslov">
        <input type="text" v-model="newSong.author" placeholder="Autor">
        <input type="text" v-model="newSong.genre" placeholder="Žanr">
        <input type="text" v-model="newSong.youtubeLink" placeholder="YouTube link">
        <button @click="addNewSong">Dodaj pjesmu</button> 
      </div>
      <div v-if="showEditForm">
        <input type="text" v-model="editedSong.title" placeholder="Naslov">
        <input type="text" v-model="editedSong.author" placeholder="Autor">
        <input type="text" v-model="editedSong.genre" placeholder="Žanr">
        <input type="text" v-model="editedSong.youtubeLink" placeholder="YouTube link">
        <button @click="saveEditedSong">Spremi promjene</button>
      </div>
      <button @click="goBackHome">Povratak na početnu</button>
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
        editedSong: { id: null, title: '', author: '', genre: '', youtubeLink: '' } 
      };
    },
    computed: {
      ...mapState(['songs']),
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
        this.deleteSong(id);
      },
      addNewSong() { 
        this.newSong.id = this.songs.length + 1;
        this.addSong({ ...this.newSong });
        this.showAddForm = false;
        this.newSong = { title: '', author: '', genre: '', youtubeLink: '' };
      },
      goBackHome(){
        this.$router.push('/');
      }
    }
  };
  </script>
  
