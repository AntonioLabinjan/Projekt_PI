<template>
    <div>
      <h1>Todo List</h1>
      <ul>
        <li v-for="todo in todos" :key="todo.id" class="todo-item">
          <span :class="{ 'circle-indicator': true, done: todo.done }"></span>
          {{ todo.text }} - {{ todo.done ? 'Done' : 'Not Done' }}
          <button @click="toggleDone(todo)">
            {{ todo.done ? 'Toggle Undone' : 'Toggle Done' }}
          </button>
        </li>
      </ul>
      <input v-model="newTodoText" placeholder="Add a new todo" />
      <button @click="addTodo">Add Todo</button>
    </div>
    <user-bar></user-bar>
  </template>
    
  <script>
  import { db } from '../firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const todos = ref([]);
      const newTodoText = ref('');
      const user = ref(null); 
  
      const auth = getAuth();
      onAuthStateChanged(auth, (loggedInUser) => {
        if (loggedInUser) {
          console.log("User logged in:", loggedInUser.email); 
          user.value = loggedInUser;
          fetchTodos(); 
        } else {
          console.log("User logged out");
          user.value = null;
          todos.value = [];
        }
      });
  
      const fetchTodos = async () => {
        if (user.value) {
          console.log("Fetching todos for user:", user.value.email); // umisto email je pisalo uid, ali dela dobro...jeeej
          const querySnapshot = await getDocs(collection(db, 'users', user.value.uid, 'todos'));
          todos.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      };
  
      const addTodo = async () => {
        if (newTodoText.value.trim() && user.value) {
          console.log("Adding new todo:", newTodoText.value);
          await addDoc(collection(db, 'users', user.value.uid, 'todos'), {
            text: newTodoText.value,
            done: false
          });
          newTodoText.value = '';
          fetchTodos();
        }
      };
  
      const toggleDone = async (todo) => {
        if (user.value) {
          console.log("Toggling done for todo:", todo.id, "New status:", !todo.done);
          await updateDoc(doc(db, 'users', user.value.uid, 'todos', todo.id), {
            done: !todo.done
          });
          fetchTodos();
        }
      };
  
      onMounted(() => {
        if (user.value) {
          console.log("Component mounted. User is already signed in.");
          fetchTodos();
        } else {
          console.log("Component mounted. No user signed in.");
        }
      });
  
      return { todos, newTodoText, addTodo, toggleDone };
    }
  };
  </script>
  
  <style>
  .circle-indicator {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
    background-color: red;
  }
  .done {
    background-color: green;
  }
  </style>
  