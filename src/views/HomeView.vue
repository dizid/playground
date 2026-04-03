<script setup>
import { ref } from 'vue'

const viewMode = ref('list')

const apps = [
  { name: 'Fluid 33', url: 'https://fluid33.netlify.app/', icon: 'fa-tint', description: 'Explore fluid intimacy through guided interactive experiences.' },
  { name: 'Agent Eval', url: 'https://hirefire.dev/', icon: 'fa-bar-chart', description: 'AI agent evaluation and marketplace platform.' },
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
  { name: 'Wu Xing Zodiac', url: 'https://wuxingzodiac.me/', icon: 'fa-refresh', description: 'Discover your Chinese zodiac sign from the 60 Five Element combinations.' },
  { name: 'StatPilot', url: 'https://statpilot.mom/', icon: 'fa-line-chart', description: 'Consolidate multiple GA4 properties into one dashboard.' },
  { name: "Joe's Splat Factory", url: 'https://joes-splat-factory.netlify.app/', icon: 'fa-paint-brush', description: "Joe's colorful splat creation game." },
  { name: 'Game Portal', url: 'https://game-portal-dizid.netlify.app/', icon: 'fa-gamepad', description: 'Play free browser games instantly — no download required.' },
  { name: 'Game Playbook', url: 'https://game-playbook-general.netlify.app/#designer', icon: 'fa-book', description: 'The Engagement Playbook — 24 rules for building addictive games.' },
  { name: 'Reset Strategy', url: 'https://resetstrategy.io/', icon: 'fa-compass', description: 'Strategic intelligence platform for navigating global uncertainty.' },
  { name: 'Alchemist Mirror', url: 'https://alchemist-mirror.netlify.app/', icon: 'fa-magic', description: 'Transformation and self-reflection through alchemical symbolism.' },
  { name: 'Promoten', url: 'https://promoten.pro/', icon: 'fa-bullhorn', description: 'Affiliate marketplace for indie app developers and promoters.' },
  { name: 'AI Content Factory', url: 'https://dizid-content-factory.netlify.app', icon: 'fa-video-camera', description: 'TikTok Shop automation for Thai affiliate business.' },
  { name: 'Love Calculator', url: '/love', icon: 'fa-heart', description: 'Calculate your love compatibility score.' },
  { name: 'Guess Your Age', url: '/age', icon: 'fa-user', description: 'AI predicts your age from your first name.' },
  { name: 'Image Editor', url: '/image-editor', icon: 'fa-crop', description: 'Advanced meme creation and image editing tool.' },
]

// Pad index to 2 digits
function pad(n) {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div class="home">

    <!-- Hero -->
    <div class="hero">
      <h1 class="hero-title">
        <span>DIGITAL</span>
        <span class="hero-accent">PLAYGROUND</span>
      </h1>
      <p class="hero-sub">{{ apps.length }} experiments, tools &amp; toys by dizid</p>
    </div>

    <!-- Controls -->
    <div class="controls">
      <span class="controls-label">Projects</span>
      <div class="toggle">
        <button
          @click="viewMode = 'list'"
          :class="{ active: viewMode === 'list' }"
          title="List view"
        >
          <i class="fa fa-list"></i>
        </button>
        <button
          @click="viewMode = 'grid'"
          :class="{ active: viewMode === 'grid' }"
          title="Grid view"
        >
          <i class="fa fa-th"></i>
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="apps-list">
      <a
        v-for="(app, i) in apps"
        :key="app.url"
        :href="app.url"
        target="_blank"
        class="app-row"
      >
        <span class="row-index">{{ pad(i + 1) }}</span>
        <span class="row-body">
          <span class="row-name">{{ app.name }}</span>
          <span class="row-desc">{{ app.description }}</span>
        </span>
        <span class="row-arrow">&rarr;</span>
      </a>
    </div>

    <!-- Grid View -->
    <div v-else class="apps-grid">
      <a
        v-for="(app, i) in apps"
        :key="app.url"
        :href="app.url"
        target="_blank"
        class="grid-card"
        :style="{ animationDelay: (i * 0.03) + 's' }"
      >
        <span class="card-icon"><i :class="'fa ' + app.icon"></i></span>
        <span class="card-name">{{ app.name }}</span>
      </a>
    </div>

  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

/* ─── Hero ─── */
.hero {
  padding: 3rem 0 2rem;
  border-bottom: 2px solid var(--border);
  margin-bottom: 2rem;
}

.hero-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.hero-accent {
  color: var(--accent);
}

.hero-sub {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.8rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 1.25rem;
  margin-bottom: 0;
}

/* ─── Controls ─── */
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.controls-label {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-light);
}

.toggle {
  display: flex;
  border: 2px solid var(--border);
  border-radius: 99px;
  overflow: hidden;
}

.toggle button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 32px;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--text-light);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.toggle button:hover {
  background: var(--accent-light);
  color: var(--text);
  filter: none;
}

.toggle button.active {
  background: var(--accent);
  color: #fff;
}

/* ─── List View ─── */
.apps-list {
  display: flex;
  flex-direction: column;
}

.app-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 0.75rem;
  text-decoration: none;
  color: var(--text);
  border-left: 3px solid transparent;
  transition: border-color 0.2s, background 0.15s, padding-left 0.2s;
  position: relative;
}

.app-row:hover {
  border-left-color: var(--accent);
  background: var(--accent-bg);
  padding-left: 1rem;
}

.row-index {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-light);
  opacity: 0.3;
  min-width: 2rem;
  flex-shrink: 0;
}

.app-row:hover .row-index {
  opacity: 0.6;
  color: var(--accent);
}

.row-body {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.row-name {
  font-family: 'Space Grotesk', var(--sans-font);
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.row-desc {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.75rem;
  color: var(--text-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-arrow {
  font-size: 1.1rem;
  color: var(--accent);
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.app-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ─── Grid View ─── */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 1.25rem;
}

.grid-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.75rem 1rem 1.25rem;
  background: var(--accent-bg);
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 var(--border);
  text-decoration: none;
  color: var(--text);
  transition: transform 0.15s, box-shadow 0.15s;
  animation: cardIn 0.3s ease both;
}

.grid-card:hover {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 var(--border);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--accent);
  border-radius: 50%;
  margin-bottom: 0.75rem;
}

.card-icon i {
  font-size: 1.3rem;
  color: #fff;
}

.card-name {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
}

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .hero {
    padding: 2rem 0 1.5rem;
  }

  .row-body {
    flex-direction: column;
    gap: 0.15rem;
  }

  .row-desc {
    white-space: normal;
    font-size: 0.7rem;
  }

  .row-arrow {
    display: none;
  }

  .apps-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.85rem;
  }

  .grid-card {
    padding: 1.25rem 0.75rem 1rem;
    box-shadow: 3px 3px 0 var(--border);
  }

  .grid-card:hover {
    transform: translate(3px, 3px);
  }

  .card-icon {
    width: 44px;
    height: 44px;
  }

  .card-icon i {
    font-size: 1.1rem;
  }

  .card-name {
    font-size: 0.8rem;
  }
}
</style>
