<template>
  <div>
      <h1>Group chat</h1>
      <div v-for="message in messages" :key="message.id" class="message" :class="{ 'mine': message.user === currentUser }">
          <strong>{{ message.user }}</strong>
          <div v-if="!message.editing">
              <span v-if="!message.imageUrl">{{ message.text }}</span>
              <img v-else :src="message.imageUrl" alt="Sent image" class="sent-image" @click="showEnlargedImage(message.imageUrl)">
          </div>
          <input v-else v-model="message.editText" @keyup.enter="saveEdit(message)" />
          <span class="timestamp">{{ formatDate(message.datetime) }}</span>
          <button v-if="message.user === currentUser" @click="editMessage(message)">Edit</button>
          <button v-if="message.user === currentUser" @click="deleteMessage(message.id)">Delete</button>
      </div>
      <div class="input-container">
                  <input v-model="newMessage" placeholder="Type a message" @keyup.enter="send" @input="handleTyping" />


          <input type="file" @change="onFileSelected" accept="image/*" />
          <button @click="send">Send</button>
      </div>
      <div v-if="isTyping" class="typing-indicator">Someone is typing...</div>

      <button @click="goBackHome">Go back home</button>
      <div v-if="enlargedImage" class="modal" @click="enlargedImage = null">
          <img :src="enlargedImage" class="enlarged-image" @click.stop>
          <span class="close" @click="enlargedImage = null">&times;</span>
      </div>
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
  const selectedFile = ref(null);
  const enlargedImage = ref(null);
  const router = useRouter();
  const currentUser = computed(() => auth.currentUser?.email);
  const isTyping = ref(false);


  onMounted(() => {
    requestNotificationPermission();
    const messagesRef = collection(db, 'chatMessages');
    const q = query(messagesRef, orderBy('datetime'));
    onSnapshot(q, (snapshot) => {
      messages.value = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        imageUrl: doc.data().imageUrl,
        user: doc.data().user,
        datetime: doc.data().datetime.toDate(),
        editing: false,
        editText: doc.data().text || ''
      }));
    });
  });

  const onFileSelected = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedFile.value = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const send = async () => {
    if (!newMessage.value.trim() && !selectedFile.value) return;

    let messageData = {
      user: currentUser.value,
      datetime: new Date(),
      text: newMessage.value.trim(),
      imageUrl: selectedFile.value || ''
    };

    await addDoc(collection(db, 'chatMessages'), messageData);
    newMessage.value = '';
    selectedFile.value = null;
    showNotification('Message sent', messageData.text || 'Image sent');
  };

  const handleTyping = () => {
  isTyping.value = true;
  setTimeout(() => {
    isTyping.value = false;
  }, 10000);
};

  const editMessage = (message) => {
    messages.value = messages.value.map(m => {
      if (m.id === message.id) {
        m.editing = true;
      }
      return m;
    });
  };

  const saveEdit = async (message) => {
    const messageRef = doc(db, 'chatMessages', message.id);
    await updateDoc(messageRef, { text: message.editText });
    message.editing = false;
    message.text = message.editText;  
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

  const showEnlargedImage = (imageUrl) => {
    enlargedImage.value = imageUrl;
  };

  function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  }

  function showNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }

  return {
    messages, newMessage, send, editMessage, saveEdit, deleteMessage, goBackHome, formatDate, currentUser, onFileSelected, enlargedImage, showEnlargedImage, handleTyping
  };
}, 
};
</script>

<style scoped>
.message {
background-color: #f9f9f9;
padding: 10px 15px;
padding-right: 100px; 
border-radius: 10px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
margin-bottom: 8px;
max-width: 80%;
word-wrap: break-word;
position: relative;
align-self: flex-start; 
}

.message.mine {
background-color: #daf1da;
align-self: flex-end; 
}

.message strong {
font-size: 16px;
color: #2c3e50;
display:block;
margin-bottom: 5px;
}

.timestamp {
position: absolute; 
bottom: 5px; 
right: 10px; 
font-size: 12px;
color: #7f8c8d;
}

.sent-image {
display: block;
max-width: 100px;
max-height: 100px;
margin-top: 5px;
cursor: pointer; 
}

.input-container {
width: 100%;
display: flex;
}

input[type="text"], input[type="file"] {
flex-grow: 1;
margin-right: 10px;
padding: 10px;
border: 1px solid #ccc;
border-radius: 4px;
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
background-color: #eeeeee;
padding: 10px 0;
text-align: center;
}

.modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.7);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.enlarged-image {
max-width: 90%;
max-height: 80%;
}

.close {
position: fixed;
top: 20px;
right: 20px;
font-size: 2rem;
color: white;
cursor: pointer;
}
.typing-indicator {
  font-size: 14px;
  color: #888888; 
  margin-top: 5px; 
}
</style>
