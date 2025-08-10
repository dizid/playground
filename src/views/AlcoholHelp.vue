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
        <!-- Only increment button is kept; decrement removed as per request -->
        <span>{{ drinkCount }}</span>
        <button @click="incrementDrink">+</button>
      </div>

      <!-- Optional context inputs (kept, but display of contexts removed) -->
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
const contexts = ref([]); // Array to store contexts for each drink (kept for storage, but not displayed)
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
      // Auto-reset if not today (directly set values instead of calling removed reset function)
      drinkCount.value = 0;
      contexts.value = [];
      saveData();
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

/* Improved CSS for the Alcohol Help Tracker Page */

/* Container styles */
.alcohol-help-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Login section */
.login-section {
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-section h1 {
  margin-bottom: 10px;
  color: #333;
}

.login-section p {
  margin-bottom: 20px;
  color: #666;
}

.email-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.email-input:focus {
  border-color: #4CAF50;
  outline: none;
}

.login-button {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-button:disabled {
  background-color: #ccc;
}

.login-button:hover {
  background-color: #45a049;
}

/* Tracker section */
.tracker-section {
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tracker-section h1 {
  margin-bottom: 10px;
  color: #333;
}

.tracker-section p {
  margin-bottom: 20px;
  color: #666;
}

.counter-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.counter-controls span {
  font-size: 24px;
  margin-right: 10px;
  color: #333;
}

.counter-controls button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
}

.counter-controls button:hover {
  background-color: #45a049;
}

/* Context section */
.context-section {
  text-align: center;
  margin-bottom: 20px;
}

.context-section h3 {
  margin-bottom: 10px;
  color: #333;
}

.context-section select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.context-section select:focus {
  border-color: #4CAF50;
  outline: none;
}

.context-section button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.context-section button:disabled {
  background-color: #ccc;
}

.context-section button:hover {
  background-color: #45a049;
}

/* Motivational box */
.motivation-box {
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.motivation-box h3 {
  margin-bottom: 10px;
  color: #333;
}

.motivation-box p {
  margin-bottom: 20px;
  color: #666;
}

.motivation-box ul {
  list-style-type: none;
  padding: 0;
}

.motivation-box li {
  background: #e0f7fa;
  margin: 5px 0;
  padding: 10px;
  border-radius: 6px;
  color: #00695c;
  font-size: 14px;
}

</style>