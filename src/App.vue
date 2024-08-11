<template>
  <header>
   
  </header>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/age">We guess your Age</RouterLink>
    <RouterLink to="/love">Love calculator</RouterLink>
    <RouterLink to="/advice">Need advice?</RouterLink>
    <!-- <RouterLink to="/analyzer">Sentiment Analyzer</RouterLink> -->
    <RouterLink to="/movie">Movies</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
  <footer>
    <nav>
      <a href="https://www.linkedin.com/in/dizid/" target="_blank" class="fa fa-linkedin"></a>
      <a href="https://twitter.com/dizid" target="_blank" class="fa fa-twitter"></a>
      <a href="https://github.com/dizid" target="_blank" class="fa fa-github"></a>
      <a href="https://dev.to/dizid" target="_blank" class="fa fa-code"></a>
      <a href="https://www.instagram.com/dizidpepper" target="_blank" class="fa fa-instagram"></a>
      <a href="https://g.dev/dizid" target="_blank" class="fa fa-google"></a>
    </nav>
  </footer>
</template>


