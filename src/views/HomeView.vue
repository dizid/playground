<script setup>
import { ref } from 'vue'

const viewMode = ref('list')

const apps = [
  { name: 'Fluid 33', url: 'https://fluid33.netlify.app/', icon: 'fa-tint', description: 'Explore fluid intimacy through guided interactive experiences.' },
  { name: 'Agent Eval', url: 'https://dizid-agenteval.netlify.app/', icon: 'fa-bar-chart', description: 'AI agent evaluation and marketplace platform.' },
  { name: 'TuneCraft', url: 'https://tunecraft.music', icon: 'fa-music', description: 'A personal music taste layer on top of YouTube.' },
  { name: 'Happy Roam Travel', url: 'https://happyroam.travel', icon: 'fa-plane', description: 'AI-powered personalized Thailand travel guide.' },
  { name: 'LaunchPilot', url: 'https://launchpilot.marketing', icon: 'fa-rocket', description: 'AI marketing automation platform for businesses.' },
  { name: 'Unplugged CV', url: 'https://unplugged.cv', icon: 'fa-file-text-o', description: 'AI-powered tailored CVs and cover letters from job postings.' },
  { name: 'Read My Mind', url: 'https://readmymind.me', icon: 'fa-lightbulb-o', description: 'AI self-analysis and mind-reading experiment.' },
  { name: 'Parody Humor', url: 'https://parodyhumor.lol', icon: 'fa-smile-o', description: 'Transform any website into a humorous parody version.' },
  { name: 'Daily Dog', url: 'https://dailydog.dizid.com', icon: 'fa-paw', description: 'Your daily dose of dog content and cuteness.' },
  { name: '3P Decision Maker', url: 'https://3p.tnxz.nl', icon: 'fa-balance-scale', description: 'Systematic decision-making toolkit using the 3 P\'s method.' },
  { name: 'Crypto Info', url: 'https://crypto.tnxz.nl', icon: 'fa-bitcoin', description: 'AI-driven cryptocurrency price forecasting dashboard.' },
  { name: 'Site Improver', url: 'http://site-improver.netlify.app', icon: 'fa-wrench', description: 'Automated website analysis and rebuilding for SMBs.' },
  { name: 'MF Dizid', url: 'http://mf-dizid.netlify.app', icon: 'fa-magic', description: 'Creative digital experiments and magic effects.' },
  { name: 'URL Shortener', url: 'https://tnxz.nl', icon: 'fa-link', description: 'Simple and fast URL shortening service.' },
  { name: 'Find Happiness', url: 'https://geluk.tnxz.nl', icon: 'fa-heart', description: 'Discover what makes you happy with guided prompts.' },
  { name: 'Google 4 Games', url: 'https://google4games.com', icon: 'fa-gamepad', description: 'Curated game search powered by Google.' },
  { name: 'Dizid Homepage', url: 'https://dizid.com', icon: 'fa-home', description: 'Official Dizid Web Development homepage.' },
  { name: 'NFT Creator', url: 'https://nft.tnxz.nl', icon: 'fa-picture-o', description: 'Create and mint NFT artwork easily.' },
  { name: 'Palmdetective', url: 'https://palmdetective.mystrikingly.com', icon: 'fa-hand-paper-o', description: 'AI-powered palm reading and analysis tool.' },
  { name: 'FireHorse', url: 'https://firehorse.info/', icon: 'fa-fire', description: 'Year of the Fire Horse 2026 encyclopedia and zodiac tools.' },
  { name: 'Wu Xing Zodiac', url: 'https://wuxingzodiac.me/', icon: 'fa-yin-yang', description: 'Discover your Chinese zodiac sign from the 60 Five Element combinations.' },
  { name: 'StatPilot', url: 'https://statpilot.mom/', icon: 'fa-line-chart', description: 'Consolidate multiple GA4 properties into one dashboard.' },
]
</script>

<template>
  <div class="home">
    <h1>Digital Playground</h1>
    <p class="intro">
      Welcome to my playground. Here I test small Vue 3 projects. Recently I have been learning to use Venice.ai effectively to create code faster.
      And it works great, especially for smaller webapps.
    </p>

    <div class="view-header">
      <h2>My Apps</h2>
      <div class="view-toggle">
        <button @click="viewMode = 'list'" :class="{ active: viewMode === 'list' }" title="List view">
          <i class="fa fa-list"></i>
        </button>
        <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }" title="Grid view">
          <i class="fa fa-th"></i>
        </button>
      </div>
    </div>

    <!-- List view (default) -->
    <div v-if="viewMode === 'list'" class="apps-list">
      <a v-for="app in apps" :key="app.url" :href="app.url" target="_blank" class="app-row">
        <span class="app-row-name">{{ app.name }}</span>
        <span class="app-row-desc">{{ app.description }}</span>
      </a>
    </div>

    <!-- Grid view -->
    <div v-else class="apps-grid">
      <a v-for="app in apps" :key="app.url" :href="app.url" target="_blank" class="app-card">
        <span class="icon"><i :class="'fa ' + app.icon"></i></span>
        <span class="name">{{ app.name }}</span>
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

/* View header with toggle */
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
}

.view-header h2 {
  margin: 0;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
}

.view-toggle button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--accent-bg);
  color: var(--text-light, #888);
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle button:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.view-toggle button.active {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
}

/* List view */
.apps-list {
  display: flex;
  flex-direction: column;
}

.app-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  transition: background 0.15s;
}

.app-row:first-child {
  border-top: 1px solid var(--border);
}

.app-row:hover {
  background: var(--accent-bg);
}

.app-row-name {
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
  min-width: 160px;
}

.app-row-desc {
  color: var(--text-light, #888);
  font-size: 0.9rem;
}

/* Grid view */
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

/* Mobile */
@media (max-width: 500px) {
  .app-row {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.6rem 0.5rem;
  }

  .app-row-name {
    min-width: unset;
  }

  .app-row-desc {
    font-size: 0.8rem;
  }

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
