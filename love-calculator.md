# Love Calculator

A fun love compatibility calculator that generates a random compatibility score between two names.

## Tech Stack

- **Framework:** Vue 3 (Options API)
- **Backend:** None (pure frontend)
- **External APIs:** None
- **External CSS:** Font Awesome 4.7 (for heart icon)

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

## CDN Links (in index.html `<head>`)

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
```

## How It Works

1. User enters two names
2. On submit, a random score between 4 and 10 is generated
3. The score and names are saved in browser cookies
4. Score only generates once per session (won't regenerate on re-submit)

## Source Code

### `src/views/Love.vue`

```vue
<template>
    <div>
        <h1>The <i class="fa fa-heart"></i> Calculator</h1>
    <h2>How well do you match with your partner?</h2>
      <form @submit.prevent="handleSubmit">
        <input type="text" v-model="formData.name1" placeholder="Your name" />
        <input type="text" v-model="formData.name2" placeholder="Your lovers'name" />
       <p> <button type="submit">Calculate!</button></p>
      </form>
      <h2 v-if="score !== null">From 1 to 10 you fit together: <span style="color:red;">{{ score }}</span></h2>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        formData: { name1: '', name2: '' },
        score: null
      }
    },
    methods: {
      handleSubmit() {
        if (!this.score) {
          this.generateScore()
        }
        this.saveFormDataAndScoreInCookie()
      },
      generateScore() {
        // Generate a random score between 4 and 10 with a higher probability of a higher score.
        const min = 4
        const max = 10
        this.score = Math.floor(Math.random() * (max - min + 1)) + min
      },
      saveFormDataAndScoreInCookie() {
        // Save the form data and generated score in a cookie
        document.cookie = `formData=${JSON.stringify(this.formData)}; expires=Thu, 31 Dec 2024 23:59:59 GMT`
        document.cookie = `score=${this.score}; expires=Thu, 31 Dec 2024 23:59:59 GMT`
      }
    }
  }
  </script>

  <style>
.fa.fa-heart {
  color: red;
}
</style>
```

## Notes for Standalone Setup

- The original app used a shared `simple.css` stylesheet (Space Grotesk/Mono fonts, CSS variable-based light/dark theme). The standalone version should have its own styling.
- Cookie expiry date is hardcoded to Dec 2024 and should be updated.
- The score only generates once — subsequent submits just re-save to cookies. This is a quirk, not a feature.
- The app has minimal styling — the standalone version should be designed from scratch.
