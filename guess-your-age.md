# Guess Your Age

A simple app that estimates a person's age based on their first name using the Agify.io API.

## Tech Stack

- **Framework:** Vue 3 (Composition API via `setup()`)
- **Backend:** None (pure frontend)
- **External APIs:** Agify.io (free, no API key needed)

## Dependencies

```json
{
  "dependencies": {
    "vue": "^3.4",
    "vue-router": "^4.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1",
    "vite": "^6.3"
  }
}
```

## Environment Variables

None required.

## How It Works

1. User enters their first name
2. On submit, the app calls `https://api.agify.io/?name={name}`
3. The API returns a JSON object with an estimated age
4. The result is displayed to the user

## External API

**Agify.io** — Free age prediction based on first name.

- **Endpoint:** `GET https://api.agify.io/?name={name}`
- **Rate limit:** 1000 requests/day (free tier, no key)
- **Response:**
```json
{
  "count": 220149,
  "name": "marc",
  "age": 56
}
```

## Source Code

### `src/views/Age.vue`

```vue
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
```

## Notes for Standalone Setup

- The Agify API is free and requires no authentication. Rate limit is 1000 requests/day.
- The original app has no scoped CSS — it relies entirely on the parent project's `simple.css`. The standalone version needs its own styling.
- The `result` variable uses `let` instead of `const` (a minor issue — works but should be `const` since it's a ref).
- The app doesn't handle the case where the API returns `null` for age (unknown names). The standalone version should handle this.
- Name input should be validated (non-empty, trimmed) before calling the API.
