<template>
    <div>
      <h1>Guess the Number</h1>
      <p v-if="!gameOver">Guess a number between 1 and 100:</p>
      <input type="number" v-model="guess" :disabled="gameOver">
      <button @click="checkGuess" :disabled="gameOver || guess === ''">Check</button>
      <p v-if="message">{{ message }}</p>
      <p v-if="!gameOver">Tries: {{ tries }}</p>
      <button @click="resetGame" v-if="gameOver">Play Again</button>
    </div>
    <button @click="goHome">Go Home</button>
  </template>
  
  <script>
  export default {
    data() {
      return {
        secretNumber: Math.floor(Math.random() * 100) + 1,
        guess: '',
        message: '',
        gameOver: false,
        tries: 0
      };
    },
    methods: {
        goHome(){
this.$router.push('/');
        },
      checkGuess() {
        const guessNum = parseInt(this.guess);
        if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
          this.message = 'Please enter a valid number between 1 and 100.';
          return;
        }
        this.tries++;
        if (guessNum === this.secretNumber) {
          this.message = `Congratulations! You guessed the correct number in ${this.tries} tries.`;
          this.gameOver = true;
        } else if (guessNum < this.secretNumber) {
          this.message = 'Try a higher number.';
        } else {
          this.message = 'Try a lower number.';
        }
      },
      resetGame() {
        this.secretNumber = Math.floor(Math.random() * 100) + 1;
        this.guess = '';
        this.message = '';
        this.gameOver = false;
        this.tries = 0;
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
    border: 2px solid #333;
    border-radius: 10px;
    background-color: #f0f0f0;
  }
  
  h1 {
    color: #333;
  }
  
  input[type="number"] {
    width: 50%;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    padding: 10px 20px;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  p {
    margin-top: 10px;
    color: #333;
  }
  </style>
  