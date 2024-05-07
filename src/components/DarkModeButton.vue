<template>
    <div class="toggle-switch">
      <label class="switch">
        <input type="checkbox" :checked="isChecked" @change="toggleSwitch">
        <span class="slider round"></span>
      </label>
      <span class="toggle-label">{{ label }}</span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: Boolean,
    },
    computed: {
      isChecked: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit('update:modelValue', value);
        }
      },
      label() {
        return this.isChecked ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      }
    },
    methods: {
      toggleSwitch(event) {
        this.isChecked = event.target.checked;
        this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
      },
    }
  }
  </script>
  
  <style scoped>
.toggle-label {
  margin-left: 10px;
  vertical-align: middle;
  font-weight: bold; 
  font-size: 16px; 
  color: #ffffff; 
  font-family: 'Arial', sans-serif; 
  letter-spacing: 0.5px; 
  text-shadow: 1px 1px 0px rgba(0,0,0,0.1); 
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
