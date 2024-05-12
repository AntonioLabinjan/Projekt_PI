<template>
    <button class="cool-button" @click="handleClick">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    methods: {
      handleClick() {
        console.log('Button clicked!');
      }
    }
  }
  </script>
  
  <style scoped>
  .cool-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s, color 0.3s;
    
    background-color: #4CAF50; 
    color: white;
  }
  
  .cool-button:hover {
    background-color: #45a049; /* Darker green */
  }
  
  /* Responsive styles */
  @media (max-width: 600px) {
    .cool-button {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
  </style>
  