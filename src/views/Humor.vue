<template>
    <div class="funny-view">
      <h1>Make Me Laugh!</h1>
      <input type="text" v-model="userInput" placeholder="Tell me what you find funny...">
      <button @click="getFunnyResponse">Generate Humor</button>
      <FunnyResponse :responseText="funnyText" :videoUrl="funnyVideoUrl" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import FunnyResponse from './Humor.vue'; // Adjust path if needed
  
  // State for user input
  const userInput = ref('');
  // State to hold the funny text response from ChatGPT
  const funnyText = ref('');
  // State to hold the URL of a funny video (you'll need to manage these)
  const funnyVideoUrl = ref('');
  // Replace with the actual path to your Netlify function
  const netlifyFunctionUrl = '/.netlify/functions/copenai-proxy-humor';
  
  const getFunnyResponse = async () => {
    if (!userInput.value.trim()) {
      alert('Please tell me what kind of humor you like!');
      return;
    }
  
    try {
      const response = await fetch(netlifyFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Make me laugh! The user thinks the following is funny: "${userInput.value}". Please be very funny and concise.` },
          ],
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from Netlify Function:', errorData);
        alert('Failed to get a funny response.');
        return;
      }
  
      const data = await response.json();
      funnyText.value = data.response.content;
      funnyVideoUrl.value = ''; // You'll need logic to select and set video URLs based on the text response or your own criteria
  
      // Example logic to potentially trigger a video (you'll need to expand on this)
      if (funnyText.value.toLowerCase().includes('cat')) {
        // Replace with an actual URL to a funny cat video in your assets
        funnyVideoUrl.value = new URL('../assets/funny_cat.mp4', import.meta.url).href; // Adjust path as needed
      }
  
    } catch (error) {
      console.error('Error fetching from Netlify Function:', error);
      alert('Something went wrong.');
    }
  };
  </script>
  
  <style scoped>
  .funny-view {
    padding: 20px;
    text-align: center;
  }
  
  input[type="text"] {
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }
  
  button {
    padding: 10px 20px;
    font-size: 1em;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>