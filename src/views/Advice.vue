<template>
    <div>
      <h1>Advice of the Day:</h1>
      <p v-if="currentAdvice">{{ currentAdvice.advice }}</p>
      <h1>Search for advice:</h1>
      <form @submit.prevent="searchForAdvice">
        <input type="text" v-model="searchQuery" placeholder="Type a keyword..." />
      <p>  <button type="submit">Search</button></p>
      </form>
  
      <ul v-if="searchResults.length > 0">
        <li v-for="(result, index) in searchResults" :key="index">
          {{ result.advice }}
        </li>
      </ul>
  
      <p v-else>No results. Try a different keyword</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        currentAdvice: null,
        searchQuery: '',
        searchResults: []
      }
    },
    async created() {
      this.fetchCurrentAdvice()
    },
    methods: {
      async fetchCurrentAdvice() {
        const response = await axios.get('https://api.adviceslip.com/advice')
        this.currentAdvice = response.data.slip
      },
      async searchForAdvice() {
        if (this.searchQuery.trim().length > 0) {
          try {
            const response = await axios.get(
              `https://api.adviceslip.com/advice/search/${encodeURIComponent(this.searchQuery)}`
            )
            this.searchResults = response.data.slips
          } catch (error) {
            console.error('Error searching for advice:', error)
          }
        } else {
          alert('Please enter a search query.')
        }
      }
    }
  }
  </script>