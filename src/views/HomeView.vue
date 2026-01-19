<template>
  <div class="home">
    <h1>Digital Playground</h1>
    <p class="intro">
      Welcome to my playground. Here I test small Vue 3 projects. Recently I have been learning to use Venice.ai effectively to create code faster.
      And it works great, especially for smaller webapps.
    </p>

    <h2>My Apps</h2>
    <div class="apps-grid">
      <a href="https://happyroam.travel" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-plane"></i></span>
        <span class="name">Happy Roam Travel</span>
      </a>
      <a href="https://launchpilot.marketing" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-rocket"></i></span>
        <span class="name">LaunchPilot</span>
      </a>
      <a href="https://unplugged.cv" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-file-text-o"></i></span>
        <span class="name">Unplugged CV</span>
      </a>
      <a href="https://readmymind.me" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-lightbulb-o"></i></span>
        <span class="name">Read My Mind</span>
      </a>
      <a href="https://parodyhumor.lol" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-smile-o"></i></span>
        <span class="name">Parody Humor</span>
      </a>
      <a href="https://dailydog.dizid.com" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-paw"></i></span>
        <span class="name">Daily Dog</span>
      </a>
      <a href="https://3p.tnxz.nl" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-balance-scale"></i></span>
        <span class="name">3P Decision Maker</span>
      </a>
      <a href="https://crypto.tnxz.nl" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-bitcoin"></i></span>
        <span class="name">Crypto Info</span>
      </a>
      <a href="http://site-improver.netlify.app" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-wrench"></i></span>
        <span class="name">Site Improver</span>
      </a>
      <a href="http://mf-dizid.netlify.app" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-magic"></i></span>
        <span class="name">MF Dizid</span>
      </a>
      <a href="https://tnxz.nl" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-link"></i></span>
        <span class="name">URL Shortener</span>
      </a>
      <a href="https://geluk.tnxz.nl" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-heart"></i></span>
        <span class="name">Find Happiness</span>
      </a>
      <a href="https://google4games.com" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-gamepad"></i></span>
        <span class="name">Google 4 Games</span>
      </a>
      <a href="https://dizid.com" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-home"></i></span>
        <span class="name">Dizid Homepage</span>
      </a>
      <a href="https://nft.tnxz.nl" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-picture-o"></i></span>
        <span class="name">NFT Creator</span>
      </a>
      <a href="https://palmdetective.mystrikingly.com" target="_blank" class="app-card">
        <span class="icon"><i class="fa fa-hand-paper-o"></i></span>
        <span class="name">Palmdetective</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.intro {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 700px;
}

h2 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: var(--accent-bg);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--border);
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--accent);
}

.app-card .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--accent);
  border-radius: 50%;
  margin-bottom: 0.75rem;
}

.app-card .icon i {
  font-size: 1.5rem;
  color: var(--bg);
}

.app-card .name {
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
}

@media (max-width: 500px) {
  .apps-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .app-card {
    padding: 1rem 0.75rem;
  }

  .app-card .icon {
    width: 48px;
    height: 48px;
  }

  .app-card .icon i {
    font-size: 1.25rem;
  }

  .app-card .name {
    font-size: 0.85rem;
  }
}
</style>
