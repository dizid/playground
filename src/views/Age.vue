<template>
        <h1>The Age Calculator</h1>
        <h2>Based on your first name, let us guess your age</h2>
    <div id="app">
      <form @submit.prevent="getAge">
        <input type="text" v-model="name" placeholder="Enter your name...">
       <p> <button type="submit">Get Age</button></p>
      </form>
      <p v-if="result">{{ result }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const name = ref('');
      let result = ref('');
  
      async function getAge() {
        try {
          const response = await fetch(`https://api.agify.io/?name=${encodeURIComponent(name.value)}`);
          const data = await response.json();
          result.value = `Your estimated age is ${data.age}`;
        } catch (error) {
          console.error('Error fetching Agify API:', error);
          result.value = 'Unable to get your age, please try again later.';
        }
      }
  
      return { name, getAge, result };
    },
  };
  </script>