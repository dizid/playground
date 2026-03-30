<script setup>
import MockupBrowser from './MockupBrowser.vue'

const props = defineProps({
  project: { type: Object, required: true },
  detailed: { type: Boolean, default: false },
})
</script>

<template>
  <div class="mockup-card" :class="{ detailed }">
    <MockupBrowser :url="project.url">
      <div
        class="mockup-inner"
        :style="{
          '--brand-bg': project.brand.bg,
          '--brand-primary': project.brand.primary,
          '--brand-secondary': project.brand.secondary,
          '--brand-accent': project.brand.accent,
          '--brand-text': project.brand.text,
        }"
      >
        <!-- Dashboard: sidebar + metric cards + chart bars -->
        <div v-if="project.mockup.type === 'dashboard'" class="mock mock-dashboard">
          <div class="dash-sidebar">
            <div class="dash-logo"></div>
            <div class="dash-nav-item" v-for="n in 4" :key="n"></div>
          </div>
          <div class="dash-main">
            <div class="dash-metrics">
              <div class="dash-metric" v-for="n in 3" :key="n">
                <div class="metric-value"></div>
                <div class="metric-label"></div>
              </div>
            </div>
            <div class="dash-chart">
              <div
                class="chart-bar"
                v-for="n in 7"
                :key="n"
                :style="{ height: (20 + Math.sin(n * 1.2) * 30 + n * 6) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Chat: message bubbles + input -->
        <div v-else-if="project.mockup.type === 'chat'" class="mock mock-chat">
          <div class="chat-messages">
            <div class="chat-bubble chat-left">
              <div class="bubble-line" style="width: 80%"></div>
              <div class="bubble-line" style="width: 55%"></div>
            </div>
            <div class="chat-bubble chat-right">
              <div class="bubble-line" style="width: 65%"></div>
            </div>
            <div class="chat-bubble chat-left">
              <div class="bubble-line" style="width: 90%"></div>
              <div class="bubble-line" style="width: 70%"></div>
              <div class="bubble-line" style="width: 40%"></div>
            </div>
            <div class="chat-bubble chat-right">
              <div class="bubble-line" style="width: 50%"></div>
              <div class="bubble-line" style="width: 75%"></div>
            </div>
          </div>
          <div class="chat-input">
            <div class="chat-field"></div>
            <div class="chat-send"></div>
          </div>
        </div>

        <!-- Editor: toolbar + canvas + side tools -->
        <div v-else-if="project.mockup.type === 'editor'" class="mock mock-editor">
          <div class="editor-toolbar">
            <div class="tool-btn" v-for="n in 5" :key="n"></div>
          </div>
          <div class="editor-body">
            <div class="editor-canvas">
              <div class="canvas-shape canvas-circle"></div>
              <div class="canvas-shape canvas-rect"></div>
              <div class="canvas-shape canvas-line"></div>
            </div>
            <div class="editor-sidebar">
              <div class="sidebar-swatch" v-for="n in 6" :key="n" :style="{ opacity: 0.3 + n * 0.12 }"></div>
            </div>
          </div>
        </div>

        <!-- Landing: hero + feature cards + CTA -->
        <div v-else-if="project.mockup.type === 'landing'" class="mock mock-landing">
          <div class="landing-hero">
            <div class="landing-title"></div>
            <div class="landing-subtitle"></div>
            <div class="landing-cta"></div>
          </div>
          <div class="landing-features">
            <div class="feature-card" v-for="n in 3" :key="n">
              <div class="feature-icon"></div>
              <div class="feature-text"></div>
            </div>
          </div>
        </div>

        <!-- Game: centered area + score + controls -->
        <div v-else-if="project.mockup.type === 'game'" class="mock mock-game">
          <div class="game-hud">
            <div class="game-score"></div>
            <div class="game-lives">
              <span v-for="n in 3" :key="n" class="life-dot"></span>
            </div>
          </div>
          <div class="game-area">
            <div class="game-entity game-player"></div>
            <div class="game-entity game-item" v-for="n in 3" :key="n"
              :style="{
                top: (15 + n * 20) + '%',
                left: (20 + n * 22) + '%',
              }"
            ></div>
          </div>
          <div class="game-controls">
            <div class="game-btn" v-for="n in 3" :key="n"></div>
          </div>
        </div>

        <!-- Cards: grid of content cards -->
        <div v-else-if="project.mockup.type === 'cards'" class="mock mock-cards">
          <div class="cards-header">
            <div class="cards-title-bar"></div>
            <div class="cards-search"></div>
          </div>
          <div class="cards-grid">
            <div class="content-card" v-for="n in 6" :key="n">
              <div class="card-thumb"></div>
              <div class="card-text">
                <div class="card-line" style="width: 80%"></div>
                <div class="card-line" style="width: 55%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form: input fields + button + result -->
        <div v-else-if="project.mockup.type === 'form'" class="mock mock-form">
          <div class="form-header">
            <div class="form-title"></div>
            <div class="form-desc"></div>
          </div>
          <div class="form-body">
            <div class="form-field" v-for="n in 2" :key="n">
              <div class="field-label"></div>
              <div class="field-input"></div>
            </div>
            <div class="form-submit"></div>
          </div>
          <div class="form-result">
            <div class="result-line" style="width: 70%"></div>
            <div class="result-line" style="width: 50%"></div>
          </div>
        </div>
      </div>
    </MockupBrowser>

    <!-- Card Info -->
    <div class="card-info">
      <div class="card-header">
        <i :class="'fa ' + project.icon" class="card-icon-sm"></i>
        <h3 class="card-title">{{ project.name }}</h3>
        <span v-if="project.revenue" class="revenue-badge">$</span>
      </div>
      <p class="card-desc">{{ detailed ? project.longDescription : project.description }}</p>
      <div v-if="detailed" class="card-stack">
        <span v-for="tech in project.techStack" :key="tech" class="stack-badge">{{ tech }}</span>
      </div>
      <a
        :href="project.url"
        :target="project.url.startsWith('/') ? '_self' : '_blank'"
        class="card-link"
      >
        Visit <span class="link-arrow">&rarr;</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.mockup-card {
  background: var(--accent-bg);
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 var(--border);
  transition: transform 0.15s, box-shadow 0.15s;
  animation: cardIn 0.3s ease both;
}

.mockup-card:hover {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 var(--border);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── Mockup Inner ─── */
.mockup-inner {
  width: 100%;
  height: 100%;
  background: var(--brand-bg);
  color: var(--brand-text);
  position: absolute;
  inset: 0;
}

.mock {
  width: 100%;
  height: 100%;
  padding: 8%;
  display: flex;
  flex-direction: column;
}

/* ─── Dashboard Mockup ─── */
.mock-dashboard {
  flex-direction: row;
  gap: 6%;
  padding: 5%;
}

.dash-sidebar {
  width: 18%;
  display: flex;
  flex-direction: column;
  gap: 8%;
  padding-top: 5%;
}

.dash-logo {
  width: 60%;
  height: 8px;
  background: var(--brand-primary);
  border-radius: 2px;
}

.dash-nav-item {
  width: 80%;
  height: 5px;
  background: var(--brand-text);
  opacity: 0.15;
  border-radius: 2px;
}

.dash-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8%;
}

.dash-metrics {
  display: flex;
  gap: 5%;
}

.dash-metric {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 8%;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.metric-value {
  width: 50%;
  height: 8px;
  background: var(--brand-primary);
  border-radius: 2px;
  margin-bottom: 6px;
}

.metric-label {
  width: 70%;
  height: 4px;
  background: var(--brand-text);
  opacity: 0.2;
  border-radius: 2px;
}

.dash-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 6%;
  padding-top: 5%;
}

.chart-bar {
  flex: 1;
  background: var(--brand-primary);
  border-radius: 2px 2px 0 0;
  opacity: 0.8;
  min-height: 10%;
}

.chart-bar:nth-child(even) {
  background: var(--brand-accent);
}

/* ─── Chat Mockup ─── */
.mock-chat {
  gap: 0;
  padding: 5% 6%;
}

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6%;
  justify-content: flex-end;
  overflow: hidden;
}

.chat-bubble {
  max-width: 65%;
  padding: 5% 7%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-left {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.08);
  border-bottom-left-radius: 2px;
}

.chat-right {
  align-self: flex-end;
  background: var(--brand-primary);
  opacity: 0.85;
  border-bottom-right-radius: 2px;
}

.bubble-line {
  height: 4px;
  background: var(--brand-text);
  opacity: 0.3;
  border-radius: 2px;
}

.chat-right .bubble-line {
  background: rgba(255, 255, 255, 0.6);
  opacity: 1;
}

.chat-input {
  display: flex;
  gap: 5%;
  margin-top: 5%;
  align-items: center;
}

.chat-field {
  flex: 1;
  height: 12%;
  min-height: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 99px;
}

.chat-send {
  width: 14%;
  aspect-ratio: 1;
  background: var(--brand-primary);
  border-radius: 50%;
  min-width: 16px;
  min-height: 16px;
}

/* ─── Editor Mockup ─── */
.mock-editor {
  gap: 0;
  padding: 0;
}

.editor-toolbar {
  display: flex;
  gap: 4%;
  padding: 3% 4%;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.tool-btn {
  width: 14px;
  height: 14px;
  background: var(--brand-text);
  opacity: 0.2;
  border-radius: 3px;
}

.tool-btn:first-child {
  background: var(--brand-primary);
  opacity: 0.8;
}

.editor-body {
  flex: 1;
  display: flex;
}

.editor-canvas {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-shape {
  position: absolute;
}

.canvas-circle {
  width: 30%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--brand-primary);
  opacity: 0.6;
  top: 20%;
  left: 15%;
}

.canvas-rect {
  width: 35%;
  height: 30%;
  background: var(--brand-secondary);
  opacity: 0.5;
  bottom: 20%;
  right: 20%;
  border-radius: 4px;
}

.canvas-line {
  width: 50%;
  height: 3px;
  background: var(--brand-accent);
  opacity: 0.7;
  top: 55%;
  left: 25%;
  transform: rotate(-15deg);
}

.editor-sidebar {
  width: 15%;
  display: flex;
  flex-direction: column;
  gap: 6%;
  padding: 5% 3%;
  background: rgba(255, 255, 255, 0.03);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-swatch {
  width: 80%;
  aspect-ratio: 1;
  background: var(--brand-primary);
  border-radius: 3px;
  margin: 0 auto;
}

.sidebar-swatch:nth-child(even) {
  background: var(--brand-secondary);
}

.sidebar-swatch:nth-child(3n) {
  background: var(--brand-accent);
}

/* ─── Landing Mockup ─── */
.mock-landing {
  padding: 8% 10%;
  gap: 8%;
}

.landing-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6%;
  padding: 5% 0;
}

.landing-title {
  width: 60%;
  height: 10px;
  background: var(--brand-primary);
  border-radius: 2px;
}

.landing-subtitle {
  width: 40%;
  height: 5px;
  background: var(--brand-text);
  opacity: 0.25;
  border-radius: 2px;
}

.landing-cta {
  width: 25%;
  height: 16px;
  background: var(--brand-accent);
  border-radius: 4px;
  margin-top: 3%;
}

.landing-features {
  display: flex;
  gap: 5%;
  flex: 1;
}

.feature-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10%;
}

.feature-icon {
  width: 24px;
  height: 24px;
  background: var(--brand-primary);
  border-radius: 50%;
  opacity: 0.7;
}

.feature-text {
  width: 70%;
  height: 4px;
  background: var(--brand-text);
  opacity: 0.15;
  border-radius: 2px;
}

/* ─── Game Mockup ─── */
.mock-game {
  padding: 4% 6%;
  gap: 4%;
}

.game-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-score {
  width: 15%;
  height: 8px;
  background: var(--brand-accent);
  border-radius: 2px;
}

.game-lives {
  display: flex;
  gap: 4px;
}

.life-dot {
  width: 8px;
  height: 8px;
  background: var(--brand-primary);
  border-radius: 50%;
}

.game-area {
  flex: 1;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
}

.game-entity {
  position: absolute;
  border-radius: 3px;
}

.game-player {
  width: 12%;
  height: 15%;
  background: var(--brand-primary);
  bottom: 10%;
  left: 45%;
}

.game-item {
  width: 8%;
  height: 10%;
  background: var(--brand-accent);
  opacity: 0.7;
}

.game-item:nth-child(odd) {
  background: var(--brand-secondary);
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 8%;
}

.game-btn {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}

.game-btn:nth-child(2) {
  background: var(--brand-primary);
  opacity: 0.6;
}

/* ─── Cards Mockup ─── */
.mock-cards {
  padding: 5% 6%;
  gap: 5%;
}

.cards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cards-title-bar {
  width: 30%;
  height: 8px;
  background: var(--brand-primary);
  border-radius: 2px;
}

.cards-search {
  width: 25%;
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5%;
  flex: 1;
}

.content-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-thumb {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--brand-secondary);
  opacity: 0.3;
}

.content-card:nth-child(even) .card-thumb {
  background: var(--brand-primary);
  opacity: 0.25;
}

.content-card:nth-child(3n) .card-thumb {
  background: var(--brand-accent);
  opacity: 0.3;
}

.card-text {
  padding: 8%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-line {
  height: 3px;
  background: var(--brand-text);
  opacity: 0.15;
  border-radius: 1px;
}

/* ─── Form Mockup ─── */
.mock-form {
  padding: 8% 12%;
  gap: 6%;
  align-items: center;
}

.form-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.form-title {
  width: 50%;
  min-width: 60px;
  height: 10px;
  background: var(--brand-primary);
  border-radius: 2px;
}

.form-desc {
  width: 70%;
  min-width: 80px;
  height: 4px;
  background: var(--brand-text);
  opacity: 0.2;
  border-radius: 2px;
}

.form-body {
  width: 75%;
  display: flex;
  flex-direction: column;
  gap: 8%;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  width: 30%;
  height: 4px;
  background: var(--brand-text);
  opacity: 0.2;
  border-radius: 2px;
}

.field-input {
  width: 100%;
  height: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
}

.form-submit {
  width: 40%;
  height: 18px;
  background: var(--brand-primary);
  border-radius: 4px;
  align-self: center;
  margin-top: 2%;
}

.form-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-top: 3%;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  width: 60%;
}

.result-line {
  height: 4px;
  background: var(--brand-accent);
  opacity: 0.4;
  border-radius: 2px;
}

/* ─── Card Info ─── */
.card-info {
  padding: 0.75rem 0.85rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.3rem;
}

.card-icon-sm {
  color: var(--accent);
  font-size: 0.8rem;
  width: 1rem;
  text-align: center;
}

.card-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

.revenue-badge {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.6rem;
  background: var(--accent);
  color: #fff;
  padding: 0.1rem 0.35rem;
  border-radius: 99px;
  font-weight: 700;
}

.card-desc {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.65rem;
  color: var(--text-light);
  line-height: 1.5;
  margin: 0 0 0.5rem;
}

.card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.stack-badge {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.55rem;
  padding: 0.15rem 0.4rem;
  border: 1px solid var(--border);
  border-radius: 99px;
  color: var(--text-light);
  white-space: nowrap;
}

.card-link {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: gap 0.2s;
}

.card-link:hover {
  gap: 0.5rem;
}

.link-arrow {
  transition: transform 0.2s;
}

.card-link:hover .link-arrow {
  transform: translateX(2px);
}

/* ─── Detailed Mode ─── */
.mockup-card.detailed {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
}

.mockup-card.detailed .card-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mockup-card.detailed .card-desc {
  font-size: 0.7rem;
}

@media (max-width: 700px) {
  .mockup-card.detailed {
    grid-template-columns: 1fr;
  }
}
</style>
