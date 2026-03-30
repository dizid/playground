<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal.js'
import { projects, milestones, stats, CATEGORIES } from '../data/projects.js'
import StoryTimeline from '../components/StoryTimeline.vue'
import StoryStats from '../components/StoryStats.vue'
import AppMockupCard from '../components/AppMockupCard.vue'

const { observe } = useScrollReveal()

// Template ref collector for scroll-reveal sections
const sections = ref([])

function setSectionRef(el) {
  if (el) sections.value.push(el)
}

onMounted(() => {
  sections.value.forEach(el => observe(el))
})

// Early projects shown in Origin section
const earlyProjects = ['dizid', 'urlshortener', 'lovecalc']
  .map(id => projects.find(p => p.id === id))
  .filter(Boolean)

// Categories excluding 'all', each with its projects
const categoryStrips = CATEGORIES
  .filter(cat => cat.id !== 'all')
  .map(cat => ({
    ...cat,
    items: projects.filter(p => p.category === cat.id),
  }))
  .filter(cat => cat.items.length > 0)

// Tech stack rows
const techStack = [
  {
    label: 'Core',
    color: '#00d9ff',
    items: ['Vue 3', 'TypeScript', 'Tailwind CSS 4', 'Vite'],
  },
  {
    label: 'Backend',
    color: '#a855f7',
    items: ['Netlify', 'Neon PostgreSQL', 'Supabase', 'Firebase'],
  },
  {
    label: 'AI',
    color: '#f59e0b',
    items: ['Claude AI', 'OpenAI', 'Grok AI'],
  },
  {
    label: 'Payments',
    color: '#3b82f6',
    items: ['Stripe'],
  },
]
</script>

<template>
  <div class="story">

    <!-- ─────────────────────────────────────────────────────────
         1. CINEMATIC HERO
         ───────────────────────────────────────────────────────── -->
    <section class="hero-section">
      <div class="hero-bg-gradient"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-line">THE DIZID</span>
          <span class="hero-line hero-accent">STORY</span>
        </h1>
        <p class="hero-sub">One founder. Forty-two projects. Zero employees.</p>
      </div>
      <div class="hero-chevron" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────────────────
         2. STATS BAND
         ───────────────────────────────────────────────────────── -->
    <section class="stats-section">
      <div
        class="reveal stats-inner"
        :ref="setSectionRef"
      >
        <StoryStats :stats="stats" />
      </div>
    </section>

    <!-- ─────────────────────────────────────────────────────────
         3. ORIGIN
         ───────────────────────────────────────────────────────── -->
    <section class="container-section">
      <div
        class="reveal"
        :ref="setSectionRef"
      >
        <h2 class="section-title">FROM IDEA TO EMPIRE</h2>

        <div class="origin-layout">
          <div class="origin-text">
            <p class="story-p">
              What started as a personal playground — a place to experiment with Vue 3 and ship small ideas fast — grew into something unexpected.
              42 projects. 25+ live URLs. 7 revenue streams. All built by one developer and an AI workforce of 18 specialized agents.
            </p>
            <p class="story-p">
              No team. No office. No meetings. Just a 2019 HP Envy laptop, Claude Code, and the belief that shipping beats planning.
            </p>
            <p class="story-p">
              The early experiments were simple — a love calculator, an age guesser, a URL shortener. But each project taught something new.
              Stack by stack, feature by feature, the Dizid identity emerged: fast, functional, and always a little unconventional.
            </p>
          </div>

          <div class="origin-cards">
            <AppMockupCard
              v-for="project in earlyProjects"
              :key="project.id"
              :project="project"
              :detailed="false"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────────────────
         4. TIMELINE
         ───────────────────────────────────────────────────────── -->
    <section class="container-section">
      <div
        class="reveal"
        :ref="setSectionRef"
      >
        <h2 class="section-title">THE JOURNEY</h2>
        <StoryTimeline :milestones="milestones" />
      </div>
    </section>

    <!-- ─────────────────────────────────────────────────────────
         5. CATEGORY PORTFOLIO
         ───────────────────────────────────────────────────────── -->
    <section class="container-section portfolio-section">
      <div
        class="reveal"
        :ref="setSectionRef"
      >
        <h2 class="section-title">THE PORTFOLIO</h2>
      </div>

      <div
        v-for="(cat, index) in categoryStrips"
        :key="cat.id"
        class="reveal category-strip"
        :ref="setSectionRef"
        :style="{ transitionDelay: (index * 0.08) + 's' }"
      >
        <div class="cat-header">
          <span class="cat-name">{{ cat.label }}</span>
          <span class="cat-count">{{ cat.items.length }} project{{ cat.items.length === 1 ? '' : 's' }}</span>
        </div>

        <div class="cat-scroll">
          <AppMockupCard
            v-for="project in cat.items"
            :key="project.id"
            :project="project"
            :detailed="false"
            class="cat-card"
          />
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────────────────
         6. TECH STACK
         ───────────────────────────────────────────────────────── -->
    <section class="stats-section stack-section">
      <div
        class="reveal stack-inner"
        :ref="setSectionRef"
      >
        <h2 class="section-title section-title--center">THE STACK</h2>

        <div class="stack-rows">
          <div
            v-for="(row, rowIndex) in techStack"
            :key="row.label"
            class="stack-row"
          >
            <span class="stack-row-label">{{ row.label }}</span>
            <div class="stack-badges">
              <span
                v-for="(item, itemIndex) in row.items"
                :key="item"
                class="stack-badge"
                :style="{
                  borderLeftColor: row.color,
                  transitionDelay: (rowIndex * 0.1 + itemIndex * 0.07) + 's',
                }"
              >{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────────────────
         7. CLOSING
         ───────────────────────────────────────────────────────── -->
    <section class="container-section closing-section">
      <div
        class="reveal"
        :ref="setSectionRef"
      >
        <h2 class="section-title">WHAT'S NEXT</h2>
        <p class="story-p story-p--wide">
          The playground keeps growing. New experiments ship weekly. The AI workforce gets smarter.
          And the best part? We're just getting started.
        </p>

        <div class="cta-row">
          <a href="/showcase" class="cta-btn">
            View Showcase
          </a>
          <a href="https://github.com/dizid" target="_blank" rel="noopener" class="cta-btn">
            GitHub
          </a>
          <a href="https://dizid.com" target="_blank" rel="noopener" class="cta-btn cta-btn--accent">
            Dizid.com
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ─────────────────────────────────────────────────────────────
   Scroll reveal classes
   ───────────────────────────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal[data-revealed='true'] {
  opacity: 1;
  transform: translateY(0);
}

/* ─────────────────────────────────────────────────────────────
   Page wrapper
   ───────────────────────────────────────────────────────────── */
.story {
  /* Reset the global #app max-width / text-align so this page can go full-width */
  width: 100%;
  max-width: 100%;
  text-align: left;
  padding: 0;
  margin: 0;
}

/* ─────────────────────────────────────────────────────────────
   Section layout helpers
   ───────────────────────────────────────────────────────────── */
.container-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
}

/* Full-width band sections (stats, stack) */
.stats-section {
  background: var(--accent-bg);
  border-top: 2px solid var(--border);
  border-bottom: 2px solid var(--border);
  padding: 4rem 1.5rem;
}

.stats-inner,
.stack-inner {
  max-width: 1000px;
  margin: 0 auto;
}

/* ─────────────────────────────────────────────────────────────
   Section titles
   ───────────────────────────────────────────────────────────── */
.section-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0 0 2.5rem;
  color: var(--text);
  border-bottom: 2px solid var(--border);
  padding-bottom: 0.75rem;
}

.section-title--center {
  text-align: center;
  border-bottom: none;
  padding-bottom: 0;
}

/* ─────────────────────────────────────────────────────────────
   1. Hero
   ───────────────────────────────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.hero-bg-gradient {
  position: absolute;
  inset: 0;
  /* Radial glow from center */
  background:
    radial-gradient(ellipse 60% 50% at 50% 40%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%),
    var(--bg);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin: 0 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-line {
  display: block;
}

.hero-accent {
  color: var(--accent);
}

.hero-sub {
  font-family: 'Space Mono', var(--mono-font);
  font-size: clamp(0.75rem, 2vw, 1rem);
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0;
}

/* Animated scroll chevron */
.hero-chevron {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-light);
  opacity: 0.5;
  animation: bounce 2.2s ease-in-out infinite;
  z-index: 1;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* ─────────────────────────────────────────────────────────────
   3. Origin
   ───────────────────────────────────────────────────────────── */
.origin-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 3rem;
  align-items: start;
}

.origin-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.story-p {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.82rem;
  color: var(--text-light);
  line-height: 1.85;
  margin: 0;
}

.story-p--wide {
  max-width: 640px;
  font-size: 0.88rem;
}

.origin-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ─────────────────────────────────────────────────────────────
   5. Portfolio category strips
   ───────────────────────────────────────────────────────────── */
.portfolio-section {
  /* Override standard container-section: no max-width for the scroll strips */
  max-width: 100%;
  padding-left: 0;
  padding-right: 0;
}

/* Title inside portfolio section still uses container */
.portfolio-section > .reveal:first-child {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.category-strip {
  max-width: 100%;
  margin-bottom: 3rem;
  padding: 0 1.5rem;
}

.cat-header {
  max-width: 1000px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.cat-name {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

.cat-count {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.7rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.cat-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.75rem;
  /* Scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.cat-scroll::-webkit-scrollbar {
  height: 4px;
}

.cat-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 99px;
}

/* Each card in the horizontal strip */
.cat-card {
  width: 260px;
  flex-shrink: 0;
  scroll-snap-align: start;
}

/* ─────────────────────────────────────────────────────────────
   6. Tech Stack
   ───────────────────────────────────────────────────────────── */
.stack-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.stack-rows {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
}

.stack-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stack-row-label {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-light);
  min-width: 4.5rem;
  flex-shrink: 0;
}

.stack-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stack-badge {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.72rem;
  padding: 0.4rem 0.85rem;
  border: 2px solid var(--border);
  border-left-width: 4px;
  /* border-left-color set inline per row */
  color: var(--text);
  background: var(--bg);
  white-space: nowrap;
  /* Stagger in when parent reveals */
  transition: background 0.2s;
}

.stack-badge:hover {
  background: var(--accent-bg);
}

/* ─────────────────────────────────────────────────────────────
   7. Closing
   ───────────────────────────────────────────────────────────── */
.closing-section {
  padding-bottom: 7rem;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.5rem;
}

.cta-btn {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 0.7rem 1.5rem;
  border: 2px solid var(--border);
  color: var(--text);
  text-decoration: none;
  background: transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-btn:hover {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.cta-btn--accent {
  border-color: var(--accent);
  color: var(--accent);
}

.cta-btn--accent:hover {
  background: var(--accent);
  color: var(--bg);
}

/* ─────────────────────────────────────────────────────────────
   Mobile
   ───────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .container-section {
    padding: 3.5rem 1rem;
  }

  .stats-section {
    padding: 3rem 1rem;
  }

  .hero-title {
    letter-spacing: -0.03em;
  }

  .hero-chevron {
    bottom: 1.5rem;
  }

  .origin-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .origin-cards {
    flex-direction: row;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 0.75rem;
    padding-bottom: 0.5rem;
  }

  .origin-cards > * {
    width: 240px;
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  .category-strip {
    padding: 0 1rem;
  }

  .cat-card {
    width: 220px;
  }

  .stack-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .stack-row-label {
    min-width: auto;
  }

  .cta-row {
    flex-direction: column;
  }

  .cta-btn {
    text-align: center;
    justify-content: center;
  }

  .section-title {
    font-size: clamp(1.5rem, 7vw, 2rem);
    margin-bottom: 2rem;
  }
}
</style>
