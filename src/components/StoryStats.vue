<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="stats-grid">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="stat-card"
    >
      <div class="stat-number">
        {{ stat.value }}<span class="stat-suffix">{{ stat.suffix }}</span>
      </div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--accent-bg);
  border: 2px solid var(--border);
  padding: 1.5rem;
  text-align: center;
  /* Subtle left accent bar */
  border-left: 4px solid var(--accent);
}

.stat-number {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
}

.stat-suffix {
  font-size: 0.65em;
  vertical-align: super;
  letter-spacing: 0;
}

.stat-label {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-light);
}

@media (max-width: 600px) {
  .stats-grid {
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card {
    padding: 1.25rem 1rem;
  }
}
</style>
