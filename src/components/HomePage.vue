<template>
  <div class="container">
    <div class="login-signup-buttons">
      <button @click="goToLogIn">Log In</button>
      <button @click="goToSignUp">Sign Up</button>
    </div>
    <div class="header">
      <h1>Welcome to Vue Trainer</h1>
      <hr>
      <h4>Your personal training application</h4>
      <p>Add your exercises, meals, sleep, water intake, calculate your BMI, and track your progress!</p>
    </div>
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
    <div class="about-button">
      <button @click="goToAbout">About</button>
    </div>
    <div class="motivational-quote">
      <p>{{ motivationalQuote }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // dodat ih baren još 20
      motivationalQuotes: [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Everything you’ve ever wanted is on the other side of fear. - George Addair",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
  "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
  "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
  "It always seems impossible until it’s done. - Nelson Mandela",
  "Your limitation—it’s only your imagination. - Unknown",
  "Push yourself, because no one else is going to do it for you. - Unknown",
  "Great things never come from comfort zones. - Unknown",
  "Dream it. Wish it. Do it. - Unknown",
  "Success doesn’t just find you. You have to go out and get it. - Unknown",
   "It takes courage to grow up and become who you really are. — E.E. Cummings",
"Your self-worth is determined by you. You don't have to depend on someone telling you who you are. - Beyoncé",
"Nothing is impossible. The word itself says 'I'm possible!' — Audrey Hepburn",
 "Keep your face always toward the sunshine, and shadows will fall behind you. — Walt Whitman",
"You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. You're on your own. And you know what you know. And you are the guy who'll decide where to go. — Dr. Seuss",
"Attitude is a little thing that makes a big difference. — Winston Churchill",
"To bring about change, you must not be afraid to take the first step. We will fail when we fail to try. — Rosa Parks",
"All our dreams can come true, if we have the courage to pursue them. — Walt Disney",
"Don't sit down and wait for the opportunities to come. Get up and make them. — Madam C.J. Walker",
"Champions keep playing until they get it right. — Billie Jean King",
"I am lucky that whatever fear I have inside me, my desire to win is always stronger. — Serena Williams",
"You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
"It is during our darkest moments that we must focus to see the light. — Aristotle",
"Believe you can and you're halfway there. — Theodore Roosevelt",
"Life shrinks or expands in proportion to one’s courage. — Anaïs Nin",
"Just don't give up trying to do what you really want to do. Where there is love and inspiration, I don't think you can go wrong. — Ella Fitzgerald",
"Try to be a rainbow in someone's cloud. — Maya Angelou",
"If you don't like the road you're walking, start paving another one. — Dolly Parton",
"Real change, enduring change, happens one step at a time. — Ruth Bader Ginsburg",
"All dreams are within reach. All you have to do is keep moving towards them. — Viola Davis",
"It is never too late to be what you might have been. — George Eliot",
"When you put love out in the world it travels, and it can touch people and reach people in ways that we never even expected. — Laverne Cox",
"Give light and people will find the way. — Ella Baker",
"It always seems impossible until it's done. — Nelson Mandela",
"Don’t count the days, make the days count. — Muhammad Ali",
"If you risk nothing, then you risk everything. — Geena Davis",
"Definitions belong to the definers, not the defined. — Toni Morrison",
"When you have a dream, you've got to grab it and never let go. — Carol Burnett",
"Never allow a person to tell you no who doesn’t have the power to say yes. — Eleanor Roosevelt",
"When it comes to luck, you make your own. — Bruce Springsteen",
"If you're having fun, that's when the best memories are built. — Simone Biles",
"Failure is the condiment that gives success its flavor. — Truman Capote",
"Hard things will happen to us. We will recover. We will learn from it. We will grow more resilient because of it. — Taylor Swift",
"Your story is what you have, what you will always have. It is something to own. — Michelle Obama",
"To live is the rarest thing in the world. Most people just exist. — Oscar Wilde",
"You define beauty yourself, society doesn’t define your beauty. — Lady Gaga",
"Optimism is a happiness magnet. If you stay positive, good things and good people will be drawn to you. — Mary Lou Retton",
"You just gotta keep going and fighting for everything, and one day you’ll get to where you want. — Naomi Osaka",
"If you prioritize yourself, you are going to save yourself. — Gabrielle Union",
"No matter how far away from yourself you may have strayed, there is always a path back. You already know who you are and how to fulfill your destiny. — Oprah Winfrey",
"A problem is a chance for you to do your best. — Duke Ellington",
"You can’t turn back the clock. But you can wind it up again. — Bonnie Prudden",
"When you can’t find someone to follow, you have to find a way to lead by example. — Roxane Gay",
"There is no better compass than compassion. — Amanda Gorman",
"Stand before the people you fear and speak your mind – even if your voice shakes. — Maggie Kuhn",
"It’s a toxic desire to try to be perfect. I realized later in life that the challenge is not to be perfect. It’s to be whole. — Jane Fonda",
"Vitality shows not only in the ability to persist but in the ability to start over. — F. Scott Fitzgerald",
"The most common way people give up their power is by thinking they don’t have any. — Alice Walker",
"Love yourself first and everything else falls into line. — Lucille Ball",
"In three words I can sum up everything I've learned about life: It goes on. — Robert Frost",

]

      motivationalQuote: ""
    };
  },
  methods: {
    selectRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
      this.motivationalQuote = this.motivationalQuotes[randomIndex];
    },
    // Metode za rutiranje na druge stranice
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
  },
  mounted() {
    this.selectRandomQuote();
  }
};
</script>

<style scoped>
</style>
