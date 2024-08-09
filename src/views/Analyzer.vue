<template>
 <h1>Twitter / X Sentiment ANALYZER</h1>
 <h2>
  Not working -- YET
 </h2>
    <div>
      <!-- Display tweets -->
      <ul v-if="tweets.length">
        <li v-for="(tweet, index) in tweets" :key="index">
          {{ tweet.text }} - Sentiment: {{ tweet.sentiment }}
        </li>
      </ul>
  
      <!-- Loading indicator -->
      <p v-else>Loading...</p>
  
      <!-- Display average sentiment -->
      <p>Average Sentiment Score: {{ avgSentiment }}</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const tweets = ref([]);
      const avgSentiment = ref(0);
  
      // Fetch tweets and perform sentiment analysis
      async function fetchTweetsAndAnalyze() {
        try {
        //  const response = await axios.get('https://api.twitter.com/1.1/statuses/user_timeline.json', {
            const response = await axios.get('https://api.twitter.com/1.1/statuses/user_timeline.json', {
// https://cors-anywhere.herokuapp.com/https://api.twitter.com/oauth/request_token

            params: {
              screen_name: 'twitter/dizid', // Replace with desired user handle
              count: 50,
            },
          });
  
          tweets.value = response.data.map((tweet) => ({
            text: tweet.text,
            sentiment: /* await */ getSentimentAnalysisScore(tweet.id_str),
          }));
  
          avgSentiment.value = calculateAverageSentiment(tweets.value);
        } catch (error) {
          console.error(error);
        }
      }
  
      // Perform sentiment analysis using a free API
      async function getSentimentAnalysisScore(tweetId) {
        try {
          const response = await axios.get('https://api.edenai.run/v2/text/sentiment_analysis', {
            params: {
              tweet_id: tweetId,
            },
          });
  
          return response.data.sentiment_score;
        } catch (error) {
          console.error(error);
        }
      }
  
      // Calculate average sentiment score
      function calculateAverageSentiment(tweets) {
        let totalScore = 0;
  
        tweets.forEach((tweet) => {
          totalScore += tweet.sentiment;
        });
  
        return totalScore / tweets.length;
      }
  
      onMounted(fetchTweetsAndAnalyze);
  
      return { tweets, avgSentiment };
    },
  };
  </script>