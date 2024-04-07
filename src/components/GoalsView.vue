<template>
    <div>
      <h2>Postavljanje Cilja</h2>
      
      <div>
        <label for="exerciseHours">Željeno vrijeme treninga (u satima):</label>
        <input type="number" id="exerciseHours" v-model.number="exerciseHours">
        <button @click="saveExerciseGoal">Spremi cilj za vrijeme treninga</button>
        <p v-if="exerciseGoalSaved">Ciljano vrijeme treninga: {{ exerciseHours }} sati</p>
      </div>
      
      <div>
        <label for="caloriesIntake">Željeni ukupan unos kalorija:</label>
        <input type="number" id="caloriesIntake" v-model.number="caloriesIntake">
        <button @click="saveCaloriesGoal">Spremi cilj za unos kalorija</button>
        <p v-if="caloriesGoalSaved">Ciljani unos kalorija: {{ caloriesIntake }}</p>
      </div>
      
      <div>
        <label for="waterIntake">Željeni ukupan unos tekućine (u ml):</label>
        <input type="number" id="waterIntake" v-model.number="waterIntake">
        <button @click="saveWaterIntakeGoal">Spremi cilj za unos tekućine</button>
        <p v-if="waterIntakeGoalSaved">Ciljani unos tekućine: {{ waterIntake }} ml</p>
      </div>
      
      <div>
        <label for="sleepHours">Željeni broj sati sna:</label>
        <input type="number" id="sleepHours" v-model.number="sleepHours">
        <button @click="saveSleepHoursGoal">Spremi cilj za broj sati sna</button>
        <p v-if="sleepHoursGoalSaved">Ciljani sati sna: {{ sleepHours }} sati</p>
      </div>
      
      <button @click="goBackHome">Povratak na početnu stranicu</button>
    </div>
  </template>
  <script>

  import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['totalExerciseHours', 'totalCaloriesIntake', 'totalWaterIntake', 'totalSleepHours']),
  },
  data() {
    return {
      exerciseHours: 0,
      caloriesIntake: 0,
      waterIntake: 0,
      sleepHours: 0,
      exerciseGoalSaved: false,
      caloriesGoalSaved: false,
      waterIntakeGoalSaved: false,
      sleepHoursGoalSaved: false
    };
  },
  methods: {
    ...mapActions(['setExerciseGoal', 'setCaloriesGoal', 'setWaterIntakeGoal', 'setSleepHoursGoal']),
    calculateProgress(goal, total) {
      if (total === 0) return 0;
      const percentage = (goal / total) * 100;
      return percentage.toFixed(2);
    },
    saveExerciseGoal() {
      this.$store.dispatch('setExerciseGoal', this.exerciseHours);
      this.exerciseGoalSaved = true;
    },
    saveCaloriesGoal() {
      this.$store.dispatch('setCaloriesGoal', this.caloriesIntake);
      this.caloriesGoalSaved = true;
    },
    saveWaterIntakeGoal() {
      this.$store.dispatch('setWaterIntakeGoal', this.waterIntake);
      this.waterIntakeGoalSaved = true;
    },
    saveSleepHoursGoal() {
      this.$store.dispatch('setSleepHoursGoal', this.sleepHours);
      this.sleepHoursGoalSaved = true;
    },
    goBackHome() {
      this.$router.push({ path: '/' });
    },
  }
};
</script>
