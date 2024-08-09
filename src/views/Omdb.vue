<template>
    <div>
      <h1>Search Movies:</h1>
      <form @submit.prevent="searchForMovies">
        <input type="text" v-model="searchTerm" placeholder="Enter movie keyword..." />
        <button type="submit">Search</button>
      </form>
  
      <p v-if="!movieResults || !movieResults.length">No results found.</p>
  
      <div v-else>
        <h2>{{ searchTerm }}</h2>
        <ul>
          <li v-for="(result, index) in movieResults" :key="index">
            {{ result.Title }} ({{ result.Year }})
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        searchTerm: '',
        movieResults: []
      }
    },
    methods: {
      async searchForMovies() {
        this.movieResults = [] // Clear the movie results array before making a new search
        if (this.searchTerm.trim().length > 0) {
          try {
            const response = await axios.get(
              `http://www.omdbapi.com/?apikey=10a8315&s=${encodeURIComponent(this.searchTerm)}`
            )
            this.movieResults =
              response.data.Search && response.data.Search.length > 0
                ? response.data.Search
                : [] // Assign the Search property from the API response to movieResults, but only if there are results
          } catch (error) {
            console.error('Error searching for movies:', error)
          }
        } else {
          alert('Please enter a search keyword.')
        }
      }
    },
    watch: {
      searchTerm(newValue, oldValue) {
        // Clear the movie results array whenever the search term changes
        this.movieResults = []
      }
    }
  }
  </script>