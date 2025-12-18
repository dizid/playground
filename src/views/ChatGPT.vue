<template>
  <!-- this page uses the proxy in netlify/functions/openai-proxy.js -->
  <div id="chat-container">


    <!-- Selection box for extra prompt instructions -->
    <div class="controls">
      <label for="instruction-select">
        Chat with:
      </label>
      <select id="instruction-select" v-model="extraInstruction">
        <option value="English, grumpy, cynical, old man who hates people">Bruce</option>
        <option
          value="Very broken, short, english, always talks about money and costs and profit, Luddite, incomprehensible, hard to understand">
          Giomoney</option>
        <option value="English, talks very drunk and stoned, has hearing problems">Marc</option>
        <option value="English, Psychologizer, guru, wise, Luddite, keep it short">Alun</option>
        <option value="Only speaks French with a few English words mixed in, very cheerfull, keep it short">Marco
        </option>
        <option value="English, only uses words like happy, happy, ohh yes, thats right, thats good, keep it short">
          Nick
        </option>
      </select>
    </div>

    <!-- Conversation messages -->
    <div class="messages-container">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
        <strong>{{ message.role === 'user' ? 'You' : (message.persona || currentPersonaDisplay) }}:</strong> {{ message.content }}
      </div>
    </div>

    <!-- Input field for user to send a message -->
    <div class="input-container">
      <input type="text" id="user-input" v-model="inputValue" @keyup.enter="sendMessage" :disabled="isLoading"
        placeholder="Type your message..." />
      <button @click="sendMessage" :disabled="isLoading || !inputValue.trim()">
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const inputValue = ref('');
const messages = ref([]);
const extraInstruction = ref('');
const isLoading = ref(false);
const error = ref('');

const currentPersonaDisplay = computed(() => {
  switch (extraInstruction.value) {
    case 'English, grumpy, cynical, old man who hates people':
      return 'Bruce';
    case 'Very broken, short, english, always talks about money and costs and profit, Luddite, incomprehensible, hard to understand':
      return 'Giomoney';
    case 'English, talks very drunk and stoned, has hearing problems':
      return 'Marc';
    case 'English, Psychologizer, guru, wise, Luddite, keep it short':
      return 'Alun';
    case 'Only speaks French with a few English words mixed in, very cheerfull, keep it short':
      return 'Marco';
    case 'English, only uses words like happy, happy, ohh yes, thats right, thats good, keep it short':
      return 'Nick';
    default:
      return 'ChatGPT'; // Default name if no persona is selected
  }
});

async function sendMessage() {
  if (!inputValue.value.trim() || isLoading.value) return;
  error.value = '';
  isLoading.value = true;

  try {
    // Add user message to chat
    const userMessage = inputValue.value;
    messages.value.push({ role: 'user', content: userMessage });

    // Send request to Netlify function instead of directly to OpenAI
    const response = await fetch('/.netlify/functions/openai-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages.value.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        extraInstruction: extraInstruction.value
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();

    // Add response to messages (store persona so it doesn't change when user switches characters)
    messages.value.push({ role: 'assistant', content: result.message, persona: currentPersonaDisplay.value });

    // Clear input
    inputValue.value = '';
  } catch (err) {
    console.error('Error sending message:', err);
    error.value = `Error: ${err.message || 'Something went wrong'}`;
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
#chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: rgb(74, 52, 195);
}

.controls {
  margin-bottom: 15px;
}

.messages-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 5px;
}

.message.user {
  background-color: #e6f7ff;
  text-align: right;
}

.message.assistant {
  background-color: #f0f0f0;
}

.input-container {
  display: flex;
  gap: 10px;
}

input[type="text"] {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>