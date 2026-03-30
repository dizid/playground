<script setup>
import { ref, computed } from 'vue'
import { projects, CATEGORIES } from '../data/projects.js'
import AppMockupCard from '../components/AppMockupCard.vue'
import CategoryFilter from '../components/CategoryFilter.vue'

const activeCategory = ref('all')
const viewMode = ref('grid')

const filteredProjects = computed(() =>
  activeCategory.value === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory.value)
)
</script>

<template>
  <div class="showcase">

    <!-- Hero -->
    <div class="hero">
      <h1 class="hero-title">
        <span>APP</span>
        <span class="hero-accent">SHOWCASE</span>
      </h1>
      <p class="hero-sub">{{ filteredProjects.length }} project{{ filteredProjects.length === 1 ? '' : 's' }} — handcrafted by dizid</p>
    </div>

    <!-- Controls -->
    <div class="controls">
      <CategoryFilter
        :categories="CATEGORIES"
        :active="activeCategory"
        @update:active="activeCategory = $event"
      />
      <div class="toggle">
        <button
          @click="viewMode = 'grid'"
          :class="{ active: viewMode === 'grid' }"
          title="Grid view"
        >
          <i class="fa fa-th-large"></i>
        </button>
        <button
          @click="viewMode = 'detail'"
          :class="{ active: viewMode === 'detail' }"
          title="Detail view"
        >
          <i class="fa fa-list"></i>
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <TransitionGroup
      v-if="viewMode === 'grid'"
      name="cards"
      tag="div"
      class="projects-grid"
    >
      <AppMockupCard
        v-for="(project, i) in filteredProjects"
        :key="project.id"
        :project="project"
        :detailed="false"
        :style="{ animationDelay: (i * 0.04) + 's' }"
      />
    </TransitionGroup>

    <!-- Detail View -->
    <TransitionGroup
      v-else
      name="cards"
      tag="div"
      class="projects-detail"
    >
      <AppMockupCard
        v-for="(project, i) in filteredProjects"
        :key="project.id"
        :project="project"
        :detailed="true"
        :style="{ animationDelay: (i * 0.06) + 's' }"
      />
    </TransitionGroup>

  </div>
</template>

<style scoped>
.showcase {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
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
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.toggle {
  display: flex;
  border: 2px solid var(--border);
  border-radius: 99px;
  overflow: hidden;
  flex-shrink: 0;
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

/* ─── Grid View ─── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

/* ─── Detail View ─── */
.projects-detail {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ─── Card entrance animation ─── */
/* Applied to AppMockupCard root via :style animationDelay */
/* AppMockupCard already has @keyframes cardIn on .mockup-card —
   we add a stagger-in for the TransitionGroup transitions */

.cards-enter-active {
  animation: cardIn 0.3s ease both;
}

.cards-leave-active {
  animation: cardOut 0.2s ease both;
}

.cards-move {
  transition: transform 0.3s ease;
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

@keyframes cardOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .hero {
    padding: 2rem 0 1.5rem;
  }

  .controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .toggle {
    align-self: flex-end;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
