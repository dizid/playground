<!-- src/views/AlcoholHelp.vue -->
<template>
  <div class="alcohol-help-container">
    <!-- Login form if no email is stored -->
    <div v-if="!userEmail" class="login-section">
      <h1>Welcome to Alcohol Support Tracker</h1>
      <p>Enter your email to start tracking (no password needed, data stays local).</p>
      <input
        v-model="emailInput"
        type="email"
        placeholder="Your email"
        class="email-input"
      />
      <button @click="login" :disabled="!emailInput" class="login-button">
        Start Tracking
      </button>
    </div>

    <!-- Main tracker if logged in -->
    <div v-else class="tracker-section">
      <h1>Hello, {{ userEmail }}</h1>
      <p>Today's drinks: {{ drinkCount }}</p>
      <div class="counter-controls">
        <button @click="decrementDrink" :disabled="drinkCount === 0">-</button>
        <span>{{ drinkCount }}</span>
        <button @click="incrementDrink">+</button>
      </div>

      <!-- Optional context inputs -->
      <div class="context-section">
        <h3>Add Context (Optional)</h3>
        <select v-model="contextAlone">
          <option value="">Alone or with others?</option>
          <option value="alone">Alone</option>
          <option value="with others">With others</option>
        </select>
        <select v-model="contextLocation">
          <option value="">Location?</option>
          <option value="home">Home</option>
          <option value="bar">Bar</option>
          <option value="other">Other</option>
        </select>
        <button @click="saveContext" :disabled="!contextAlone && !contextLocation">
          Save Context
        </button>
      </div>

      <!-- Logged contexts display -->
      <div v-if="contexts.length" class="contexts-list">
        <h3>Today's Contexts</h3>
        <ul>
          <li v-for="(ctx, index) in contexts" :key="index">
            {{ ctx.alone }} at {{ ctx.location }} (Drink #{{ index + 1 }})
          </li>
        </ul>
      </div>

      <!-- Reset button -->
      <button @click="resetDaily" class="reset-button">Reset Today's Count</button>

      <!-- Motivational box -->
      <div class="motivation-box">
        <h3>Tips & Motivation</h3>
        <p>Remember, small steps lead to big changes. You're taking control!</p>
        <ul>
          <li>Health Tip: Reducing intake can lower cancer risks over time.</li>
          <li>Motivation: "One less drink today is a win for tomorrow."</li>
          <li>Advice: Stay hydrated – alternate with water.</li>
          <li>Quote: "Moderation is the key to enjoyment." – Anonymous</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Reactive state variables
const userEmail = ref(null);
const emailInput = ref('');
const drinkCount = ref(0);
const contexts = ref([]); // Array to store contexts for each drink
const contextAlone = ref('');
const contextLocation = ref('');
let notificationInterval = null;

// Function to login (store email locally)
const login = () => {
  if (emailInput.value) {
    localStorage.setItem('alcoholHelpEmail', emailInput.value);
    userEmail.value = emailInput.value;
    loadData(); // Load any existing data for this user
  }
};

// Function to increment drink count and optionally save context
const incrementDrink = () => {
  drinkCount.value++;
  saveData();
  if (contextAlone.value || contextLocation.value) {
    saveContext();
  }
};

// Function to decrement drink count
const decrementDrink = () => {
  if (drinkCount.value > 0) {
    drinkCount.value--;
    // Remove last context if exists
    if (contexts.value.length > 0) {
      contexts.value.pop();
    }
    saveData();
  }
};

// Function to save current context (can be called separately or with increment)
const saveContext = () => {
  contexts.value.push({
    alone: contextAlone.value || 'Not specified',
    location: contextLocation.value || 'Not specified',
  });
  // Reset inputs
  contextAlone.value = '';
  contextLocation.value = '';
  saveData();
};

// Function to reset daily count
const resetDaily = () => {
  drinkCount.value = 0;
  contexts.value = [];
  saveData();
};

// Function to save data to localStorage
const saveData = () => {
  const data = {
    drinkCount: drinkCount.value,
    contexts: contexts.value,
    lastUpdated: new Date().toISOString().split('T')[0], // Track date for daily reset if needed
  };
  localStorage.setItem(`alcoholHelpData_${userEmail.value}`, JSON.stringify(data));
};

// Function to load data from localStorage
const loadData = () => {
  const storedData = localStorage.getItem(`alcoholHelpData_${userEmail.value}`);
  if (storedData) {
    const parsed = JSON.parse(storedData);
    const storedDate = parsed.lastUpdated;
    const today = new Date().toISOString().split('T')[0];
    if (storedDate === today) {
      drinkCount.value = parsed.drinkCount;
      contexts.value = parsed.contexts;
    } else {
      // Auto-reset if not today
      resetDaily();
    }
  }
};

// Function to setup notifications (every 30 minutes)
const setupNotifications = () => {
  if (Notification.permission === 'granted') {
    startNotificationInterval();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        startNotificationInterval();
      }
    });
  }
};

const startNotificationInterval = () => {
  notificationInterval = setInterval(() => {
    new Notification('Alcohol Support Reminder', {
      body: 'How\'s your progress? Remember, you\'re in control!',
    });
  }, 30 * 60 * 1000); // 30 minutes
};

// Lifecycle hooks
onMounted(() => {
  // Check for stored email
  const storedEmail = localStorage.getItem('alcoholHelpEmail');
  if (storedEmail) {
    userEmail.value = storedEmail;
    loadData();
  }
  setupNotifications();
});

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});
</script>

<style scoped>
/* Container styles */
.alcohol-help-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Login section */
.login-section {
  text-align: center;
}

.email-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:disabled {
  background-color: #ccc;
}

/* Tracker section */
.tracker-section {
  text-align: center;
}

.counter-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.counter-controls button {
  padding: 10px 20px;
  font-size: 24px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
}

.counter-controls span {
  font-size: 32px;
  min-width: 50px;
  text-align: center;
}

/* Context section */
.context-section {
  margin: 20px 0;
}

.context-section select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.context-section button {
  padding: 10px 20px;
  background-color: #FFC107;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.context-section button:disabled {
  background-color: #ccc;
}

/* Contexts list */
.contexts-list {
  margin: 20px 0;
  text-align: left;
}

/* Reset button */
.reset-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

/* Motivation box */
.motivation-box {
  margin-top: 30px;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: left;
}

.motivation-box ul {
  list-style-type: disc;
  padding-left: 20px;
}

/* Responsive design */
@media (max-width: 480px) {
  .counter-controls button {
    padding: 8px 16px;
    font-size: 20px;
  }

  .counter-controls span {
    font-size: 28px;
  }
}
</style>