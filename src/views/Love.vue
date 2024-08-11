<template>
    <div>
        <h1>The <i class="fa fa-heart"></i> Calculator</h1>
    <h2>How well do you match with your partner?</h2>
      <form @submit.prevent="handleSubmit">
        <input type="text" v-model="formData.name1" placeholder="Your name" />
        <input type="text" v-model="formData.name2" placeholder="Your lovers'name" />
       <p> <button type="submit">Calculate!</button></p>
      </form>
      <p v-if="score !== null">From 1 to 10 you fit together: {{ score }}</p>
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