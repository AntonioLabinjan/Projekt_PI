<template>
    <div class="header">
      <h1>TrainingMate 2.0</h1>
    </div>
</template>

<script>
export default {
    name: 'VueHeader'
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 5vh; 
    max-height: 10vh; 
    background-color: #065f31;
    margin: 0;
    padding: 10px 20px; 
}

h1 {
    font-size: 36px; 
    background-image: linear-gradient(45deg, #6a5acd, #00bfff);
    -webkit-background-clip: text;
    color: transparent; 
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
    animation: pulse 1.5s infinite;
    background-clip: text;
    color: rgba(255,255,255,0.8);
}

@keyframes pulse {
    0%, 100% {
        text-shadow: 
            0 0 5px rgba(19, 167, 187, 0.5), 
            0 0 10px rgba(173, 216, 230, 0.5); 
    }
    50% {
        text-shadow: 
            0 0 10px rgba(176, 224, 230, 0.7), 
            0 0 20px rgba(173, 216, 230, 0.7); 
    }
}
</style>
