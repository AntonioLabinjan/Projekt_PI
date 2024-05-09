<template>
    <div>
        <h1>Group chat</h1>
        <div v-for="message in messages" :key="message.id" class="message" :class="{ 'mine': message.user === currentUser }">
            <strong>{{ message.user }}</strong>
            <div v-if="!message.editing">{{ message.text }}</div>
            <input v-else v-model="message.editText" @keyup.enter="saveEdit(message)" />
            <span class="timestamp">{{ formatDate(message.datetime) }}</span>
            <button v-if="message.user === currentUser" @click="editMessage(message)">Edit</button>
            <button v-if="message.user === currentUser" @click="deleteMessage(message.id)">Delete</button>
        </div>
        <div class="input-container">
            <input v-model="newMessage" placeholder="Type a message" @keyup.enter="send"/>
            <button @click="send">Send</button>
        </div>
        <button @click="goBackHome">Go back home</button>
    </div>
    <div class="user-bar">
        <user-bar></user-bar>
    </div>
</template>
  
<script>
import { db, auth } from '@/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const messages = ref([]);
    const newMessage = ref('');
    const router = useRouter();
    const currentUser = computed(() => auth.currentUser?.email);

    onMounted(() => {
      const messagesRef = collection(db, 'chatMessages');
      const q = query(messagesRef, orderBy('datetime'));
      onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map(doc => ({ id: doc.id, text: doc.data().text, user: doc.data().user, datetime: doc.data().datetime.toDate(), editing: false, editText: doc.data().text }));
      });
    });

    const send = async () => {
      if (newMessage.value.trim() !== '') {
        await addDoc(collection(db, 'chatMessages'), {
          text: newMessage.value,
          user: currentUser.value,
          datetime: new Date()
        });
        newMessage.value = '';
      }
    };

    const editMessage = (message) => {
      message.editing = true;
    };

    const saveEdit = async (message) => {
      const messageRef = doc(db, 'chatMessages', message.id);
      await updateDoc(messageRef, { text: message.editText });
      message.editing = false;
    };

    const deleteMessage = async (id) => {
      const messageRef = doc(db, 'chatMessages', id);
      await deleteDoc(messageRef);
    };

    const goBackHome = () => {
      router.push('/');
    };

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('default', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).format(new Date(date));
    };

    return { messages, newMessage, send, editMessage, saveEdit, deleteMessage, goBackHome, formatDate, currentUser };
  }, 
};
</script>
  
<style scoped>
.message {
  background-color: #f9f9f9;
  padding: 10px 15px;
  padding-right: 100px; /* Povećajte desni padding kako timestamp ne bi bio prekriven */
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  max-width: 80%;
  word-wrap: break-word;
  position: relative; /* Dodano za pozicioniranje timestamp-a */
  align-self: flex-start; /* Default alignment */
}

.message.mine {
  background-color: #daf1da; /* Light green for user's own messages */
  align-self: flex-end; /* Align own messages to the right */
}

.message strong {
  font-size: 16px;
  color: #2c3e50;
  display: block;
  margin-bottom: 5px;
}

.timestamp {
  position: absolute; /* Absolute positioning inside the message */
  top: 5px; /* Postavite vrh timestamp-a na 5px od gornjeg ruba */
  right: 10px; /* Postavite desni rub timestamp-a na 10px od desnog ruba */
  font-size: 12px;
  color: #7f8c8d;
}

.input-container {
  width: 100%;
  display: flex;
}

input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 22px);
}

button {
  background-color: #4CAF50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease; 
}

button:hover {
  background-color: #45a049;
}

.user-bar {
  width: 100%;
  background-color: #eeeeee; /* Light gray background for user bar */
  padding: 10px 0;
  text-align: center;
}
.edit-button, .delete-button {
  padding: 3px 6px;
  font-size: 12px;
  color: #fff;
  background-color: #f44336; /* Red color for delete button */
}

.edit-button {
  background-color: #ff9800; /* Orange color for edit button */
}
</style>
