<template>
    <div class="motivational-quote">
      <p>{{ motivationalQuote }}</p>
      <button @click="readMotivationalQuote">Read The Quote</button>
      <hr>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        motivationalQuotes: [
        "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
          "The only way to do great work is to love what you do. - Steve Jobs",
          "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
          "Believe you can and you're halfway there. - Theodore Roosevelt",
          "It does not matter how slowly you go as long as you do not stop. - Confucius",
          "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
          "In the middle of every difficulty lies opportunity. - Albert Einstein",
          "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
          "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
          "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
          "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
          "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
          "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
          "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
          "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
          "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
          "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
          "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
          "The best revenge is massive success. - Frank Sinatra",
          "Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll",
          "The harder I work, the luckier I get. - Samuel Goldwyn",
          "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh (Alice in Wonderland)",
          "You miss 100% of the shots you don’t take. - Wayne Gretzky",
    "Don’t count the days, make the days count. - Muhammad Ali",
    "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "Opportunities don’t happen, you create them. - Chris Grosser",
    "The only thing standing between you and your goal is the story you keep telling yourself. - Jordan Belfort",
    "Don’t watch the clock; do what it does. Keep going. - Sam Levenson",
    "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "Don't let yesterday take up too much of today. - Will Rogers",
    "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi",
    "Success is stumbling from failure to failure with no loss of enthusiasm. - Winston Churchill",
    "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh (Alice in Wonderland)",
    "If you can dream it, you can do it. - Walt Disney",
    "The only person you should try to be better than is the person you were yesterday. - Unknown",
    "Believe you can and you’re halfway there. - Theodore Roosevelt",
    "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
    "It always seems impossible until it’s done. - Nelson Mandela",
    "Your limitation—it’s only your imagination. - Unknown",
    "Dream big and dare to fail. - Norman Vaughan",
    "Life is not about waiting for the storm to pass but learning to dance in the rain. - Vivian Greene",
    "The secret of getting ahead is getting started. - Mark Twain",
    "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
    "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
    "The harder you work for something, the greater you’ll feel when you achieve it. - Unknown",
    "It’s not about how bad you want it, it’s about how hard you’re willing to work for it. - Unknown",
          "Never gonna give you up, never gonna let you down, never gonna run around and desert you, never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you. - Rick Astley"
        ],
        motivationalQuote: "",
      };
    },
    methods: {
      selectRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
        this.motivationalQuote = this.motivationalQuotes[randomIndex];
      },
      readMotivationalQuote() {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Prekida prethodni govor
          const utterance = new SpeechSynthesisUtterance(this.motivationalQuote);
          window.speechSynthesis.speak(utterance);
        } else {
          alert('Your browser does not support text-to-speech.');
        }
      }
    },
    mounted() {
      this.selectRandomQuote();
    },
  };
  </script>
  
  <style scoped>
  .motivational-quote p {
    font-style: italic;
    margin-top: 20px;
  }
  .motivational-quote button {
    font-weight: bold;
    border: 2px solid #4CAF50;
  }
  .motivational-quote button:hover {
    background-color: #4CAF50;
  }
  </style>
  


