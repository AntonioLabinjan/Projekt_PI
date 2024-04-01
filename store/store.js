import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      waterIntake: [],
      sleepEntries: [],
      meals: [],
      images: [],
      exercises: [],
      selectedDates: [], 
      currentStreak: null, 
      recordStreak: null, 
      medalCounter: 0,
      notifications: [],
      songs: [] 
    };
  },
  mutations: {
    addSong(state, song) {
      state.songs.push(song);
    },
    editSong(state, payload) {
      const { index, song } = payload;
      state.songs.splice(index, 1, song);
    },
    deleteSong(state, index) {
      state.songs.splice(index, 1);
    },
    addIntake(state, intake) {
      state.waterIntake.push(intake);
    },
    updateIntake(state, payload) {
      const { index, intake } = payload;
      state.waterIntake[index] = intake;
    },
    deleteIntake(state, index) {
      state.waterIntake.splice(index, 1);
    },
    addSleepEntry(state, entry) {
      state.sleepEntries.push(entry);
    },
    updateSleepEntry(state, payload) {
      const { index, entry } = payload;
      state.sleepEntries[index] = entry;
    },
    deleteSleepEntry(state, index) {
      state.sleepEntries.splice(index, 1);
    },
    addMeal(state, meal) {
      state.meals.push(meal);
    },
    updateMeal(state, payload) {
      const { index, meal } = payload;
      state.meals.splice(index, 1, meal);
    },
    deleteMeal(state, index) {
      state.meals.splice(index, 1);
    },
    addImage(state, image) {
      state.images.push(image);
    },
    deleteImage(state, index) {
      state.images.splice(index, 1);
    },
    addExercise(state, exercise) {
      state.exercises.push(exercise);
    },
    saveEdit(state, payload) {
      const { index, exercise } = payload;
      state.exercises.splice(index, 1, exercise);
    },
    deleteExercise(state, index) {
      state.exercises.splice(index, 1);
    },
    filterExercisesByIntensity(state, intensity) {
      state.exercises = state.exercises.filter(exercise => exercise.intensity.includes(intensity));
    },
        addDate(state, date) {
          state.selectedDates.push(date);
        },
        removeDate(state, index) {
          state.selectedDates.splice(index, 1);
        },
        updateStreak(state) {
          let streak = 0;
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
    
          for (let i = state.selectedDates.length - 1; i >= 0; i--) {
            const currentDate = new Date(state.selectedDates[i]);
            if (currentDate.toDateString() === yesterday.toDateString()) {
              streak++;
              yesterday.setDate(yesterday.getDate() - 1);
            } else {
              break;
            }
          }
    
          state.currentStreak = streak;
    
          if (streak > state.recordStreak) {
            state.recordStreak = streak;
          }
        },
        updateMedalCounter(state) {
          state.medalCounter = Math.floor(state.recordStreak / 7);
        },
        addNotification(state, notification) {
          state.notifications.push(notification);
        },
      },
  actions: {
    addSong({ commit }, song) {
      commit('addSong', song);
    },
    editSong({ commit }, payload) {
      commit('editSong', payload);
    },
    deleteSong({ commit }, index) {
      commit('deleteSong', index);
    },
    addIntake({ commit }, intake) {
      commit('addIntake', intake);
    },
    editIntake({ commit }, payload) {
      commit('updateIntake', payload);
    },
    removeIntake({ commit }, index) {
      commit('deleteIntake', index);
    },
    addSleepEntry({ commit }, entry) {
      commit('addSleepEntry', entry);
    },
    editSleepEntry({ commit }, payload) {
      commit('updateSleepEntry', payload);
    },
    removeSleepEntry({ commit }, index) {
      commit('deleteSleepEntry', index);
    },
    addMeal({ commit }, meal) {
      commit('addMeal', meal);
    },
    updateMeal({ commit }, payload) {
      commit('updateMeal', payload);
    },
    deleteMeal({ commit }, index) {
      commit('deleteMeal', index);
    },
    addImage({ commit }, image) {
      commit('addImage', image);
    },
    deleteImage({ commit }, index) {
      commit('deleteImage', index);
    },
    addExercise({ commit }, exercise) {
      commit('addExercise', exercise);
    },
    saveExerciseEdit({ commit }, payload) {
      commit('saveEdit', payload);
    },
    deleteExercise({ commit }, index) {
      commit('deleteExercise', index);
    },
    filterExercisesByIntensity({ commit }, intensity) {
      commit('filterExercisesByIntensity', intensity);
    },
    addDate({ commit, dispatch }, date) {
        commit('addDate', date);
        dispatch('updateStreak');
        dispatch('updateMedalCounter');
      },
      removeDate({ commit, dispatch }, index) {
        commit('removeDate', index);
        dispatch('updateStreak');
        dispatch('updateMedalCounter');
      },
      updateStreak({ commit }) {
        commit('updateStreak');
      },
      updateMedalCounter({ commit }) {
        commit('updateMedalCounter');
      }
    },
  getters: {
    totalIntake(state) {
      return state.waterIntake.reduce((total, intake) => total + intake.amount, 0);
    },
    totalIntakes(state) {
      return state.waterIntake.length;
    },
    averageIntakePerTime(state, getters) {
      if (getters.totalIntakes === 0) {
        return 0;
      }
      return (getters.totalIntake / getters.totalIntakes).toFixed(2);
    },
    intakeColor(state, getters) {
      const totalIntake = getters.totalIntake;
      if (totalIntake < 2000) {
        return '#dc3545'; 
      } else if (totalIntake >= 2000 && totalIntake < 2500) {
        return '#ff6d38'; 
      } else if (totalIntake >= 2500 && totalIntake < 3000) {
        return '#ffc107'; 
      } else {
        return '#28a745'; 
      }
    },
    barWidth(state, getters) {
      const dailyIntake = Math.floor(getters.totalIntake / 1000); 
      const maxWidth = 100; 
      return Math.min(dailyIntake * 20, maxWidth) + '%'; 
    },
    totalSleepEntries(state) {
      return state.sleepEntries.length;
    },
    averageSleepQuality(state) {
      if (state.sleepEntries.length === 0) {
        return 0;
      }
      const totalQuality = state.sleepEntries.reduce((total, entry) => total + entry.quality, 0);
      return (totalQuality / state.sleepEntries.length).toFixed(2);
    },
    totalCalories(state) {
      return state.meals.reduce((total, meal) => total + meal.calories, 0);
    },
    totalMeals(state) {
      return state.meals.length;
    },
    averageCaloriesPerMeal(state, getters) {
      if (getters.totalMeals === 0) {
        return 0;
      }
      return (getters.totalCalories / getters.totalMeals).toFixed(2);
    },
    totalExercises(state) {
      return state.exercises.length;
    },
    totalCaloriesBurned(state) {
      return state.exercises.reduce((total, exercise) => total + exercise.calories, 0);
    },
    totalDuration(state) {
        return state.exercises.reduce((total, exercise) => total + exercise.duration, 0);
    },
    averageDuration(state, getters) {
      if (getters.totalExercises === 0) {
        return 0;
      }
      const totalDuration = state.exercises.reduce((total, exercise) => total + exercise.duration, 0);
      return (totalDuration / getters.totalExercises).toFixed(2);
    },
    averageCaloriesPerExercise(state) {
        if (state.exercises.length === 0) {
          return 0;
        }
        const totalCalories = state.exercises.reduce((total, exercise) => total + exercise.calories, 0);
        return totalCalories / state.exercises.length;
    },
    currentStreak(state) {
        return state.currentStreak;
      },
      recordStreak(state) {
        return state.recordStreak;
      },
      selectedDates(state) {
        return state.selectedDates;
      },
      medalCounter(state) {
        return state.medalCounter;
      },
      currentCaloricBalance(state) {
        const totalCaloriesBurned = state.exercises.reduce((total, exercise) => total + exercise.calories, 0);
        const totalCaloriesIntake = state.meals.reduce((total, meal) => total + meal.calories, 0);
        let SdCheck = "totally balanced";
        if(totalCaloriesBurned<totalCaloriesIntake){
          SdCheck = "caloric suficit";
        }
        else if(totalCaloriesBurned>totalCaloriesIntake){
          SdCheck = "caloric deficit"
        }
        return (totalCaloriesIntake - totalCaloriesBurned) + ' ' + '('+ SdCheck + ')';
      },
      notifications(state) {
        return state.notifications;
      },
      addNotification(state, notifications){
        state.notifications.push(notifications);
      },
      }
    }
  );
  export default store;
