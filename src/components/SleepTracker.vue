<template>
  <div>
    <h1>Sleep Tracker</h1>
    <nav class="navbar">
      <ul class="navbar-nav">
        <li><button @click="goToTrainingApp" class="btn btn-secondary">Go to Training App</button></li>
        <li><button @click="goToImageGallery" class="btn btn-secondary">Go to Image Gallery</button></li>
        <li><button @click="goToMealTracker" class="btn btn-secondary">Go to Meal Tracker</button></li>
        <li><button @click="goToWaterIntake" class="btn btn-secondary">Go to Water Intake Tracker</button></li>
        <li><button @click="goToBMI">Go to BMI Calculator</button></li>
        <li><button @click="goToStreak">Go to Streak Tracker</button></li>
        <li><button @click="goBackHome" class="btn btn-secondary">Go back home</button></li>
      </ul> 
    </nav>
  </div>
  <hr>
    <form v-if="!editIndex" @submit.prevent="addOrEditSleepEntry" class="sleep-input-section">
      <h3 v-if="!editEntry">Sleep Entry</h3>
      <h3 v-else>Edit Sleep Entry</h3>
      <label for="date">Date:</label>
      <input v-model="newSleepEntry.date" type="date" id="date" required />

      <label for="startTime">Start Time:</label>
      <input v-model="newSleepEntry.startTime" type="time" id="startTime" required />

      <label for="wakeTime">Wake Time:</label>
      <input v-model="newSleepEntry.wakeTime" type="time" id="wakeTime" required />

      <label for="quality">Quality (1-10):</label>
      <input v-model="newSleepEntry.quality" type="number" id="quality" min="1" max="10" required />

      <button v-if="!editEntry" type="submit">Add Sleep Entry</button>
      <button v-else type="submit">Save</button>
      <button v-if="editEntry" @click="cancelEdit">Cancel</button>
    </form>

    <ul class="sleep-display-section">
      <li v-for="(entry, index) in sleepEntries" :key="index" class="sleep-item">
        <strong>Date:</strong> {{ entry.date }},
        <strong>Start Time:</strong> {{ entry.startTime }},
        <strong>Wake Time:</strong> {{ entry.wakeTime }},
        <strong>Quality:</strong> {{ entry.quality }}
        <strong>Duration:</strong> {{ calculateDuration(entry.startTime, entry.wakeTime) }}
        <button class="edit-btn" @click="editSleepEntry(index)">Edit</button>
        <button class="delete-btn" @click="deleteSleepEntry(index)">Delete</button>
      </li>
    </ul>
</template>

<script>
export default {
  data() {
    },
  },
  methods: {
    
    goBackHome() {
      this.$router.push({ path: '/' });
    },
    goToImageGallery() {
      this.$router.push({ path: '/image-gallery' });
    },
    goToTrainingApp() {
      this.$router.push({ path: '/vue-trainer' });
    },
    goToMealTracker() {
      this.$router.push({ path: '/meal-tracker' });
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
  },
};
</script>

<style scoped>

</style>
