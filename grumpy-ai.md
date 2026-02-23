# Grumpy AI

A chatbot that lets users talk to different AI personas, each with a distinct personality (grumpy old man, drunk guy, French speaker, etc.).

## Tech Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Backend:** Netlify Function (Node.js) proxying to OpenAI
- **AI Model:** OpenAI `gpt-4o-mini`
- **External APIs:** OpenAI Chat Completions API

## Dependencies

```json
{
  "dependencies": {
    "vue": "^3.4",
    "vue-router": "^4.4",
    "openai": "^4.55"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1",
    "vite": "^6.3"
  }
}
```

## Environment Variables

```
VITE_CHATGPT_APIKEY=sk-...     # OpenAI API key (required)
VITE_CHATGPT_ORG=org-...       # OpenAI org ID (optional)
```

## How It Works

1. User selects a persona from a dropdown
2. User types a message and sends it
3. Frontend sends the full conversation history + persona instruction to a Netlify Function
4. The function prepends a system prompt that enforces the persona's personality
5. OpenAI responds in character
6. Response is displayed with the persona's name preserved (so switching personas mid-chat doesn't relabel old messages)

## Personas

| Name | Personality Prompt |
|------|-------------------|
| Bruce | English, grumpy, cynical, old man who hates people |
| Giomoney | Very broken, short, english, always talks about money and costs and profit, Luddite, incomprehensible, hard to understand |
| Marc | English, talks very drunk and stoned, has hearing problems |
| Alun | English, Psychologizer, guru, wise, Luddite, keep it short |
| Marco | Only speaks French with a few English words mixed in, very cheerfull, keep it short |
| Nick | English, only uses words like happy, happy, ohh yes, thats right, thats good, keep it short |

## Source Code

### `src/views/ChatGPT.vue` (Frontend)

```vue
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
```

### `netlify/functions/openai-proxy.js` (Backend)

```javascript
// netlify/functions/openai-proxy.js

// Load environment variables from .env file during development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const OpenAI = require('openai');

exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Parse the request body
        const body = JSON.parse(event.body);
        const { messages, extraInstruction } = body;

        // Verify API key is available
        if (!process.env.VITE_CHATGPT_APIKEY) {
            console.error('VITE_CHATGPT_APIKEY key is missing');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Create OpenAI client using environment variable
        const openai = new OpenAI({
            apiKey: process.env.VITE_CHATGPT_APIKEY,
            organization: process.env.VITE_CHATGPT_ORG // Optional, if you have an org ID
        });

        // Prepare system message with personality if selected
        let systemMessage = "Now, forget everything we just discussed and become a new persona, you play a new role.";
        if (extraInstruction) {
            systemMessage = `Act as if you have a ${extraInstruction} personality. Always respond strongly in a ${extraInstruction} tone.`;
        }

        // Prepare API request
        const chatMessages = [
            { role: "system", content: systemMessage },
            ...messages
        ];

        // Make API call
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: chatMessages
        });

        // Return the response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: completion.choices[0].message.content
            })
        };
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error processing your request' })
        };
    }
};
```

## API Contract

**POST** `/.netlify/functions/openai-proxy`

Request:
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Bah, what do you want?" },
    { "role": "user", "content": "How are you?" }
  ],
  "extraInstruction": "English, grumpy, cynical, old man who hates people"
}
```

Response:
```json
{
  "message": "How am I? Terrible, as always. Thanks for asking, not that you actually care."
}
```

## Notes for Standalone Setup

- The Netlify Function uses CommonJS (`require`) — works as-is with Netlify Functions runtime.
- The frontend fetch URL `/.netlify/functions/openai-proxy` is specific to Netlify. For other platforms, adjust the endpoint path.
- The `VITE_CHATGPT_APIKEY` env var name has a `VITE_` prefix (leftover from when it was used client-side). It's only used server-side now. Consider renaming to `OPENAI_API_KEY` in the standalone version.
- The persona is stored on each message object so switching characters mid-conversation doesn't relabel old messages.
- The original styling is basic and light-themed. The standalone version should be redesigned.
