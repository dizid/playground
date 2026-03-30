<script setup>
defineProps({
  categories: { type: Array, required: true },
  active: { type: String, default: 'all' },
})

defineEmits(['update:active'])
</script>

<template>
  <div class="filter-bar">
    <button
      v-for="cat in categories"
      :key="cat.id"
      :class="['filter-pill', { active: active === cat.id }]"
      @click="$emit('update:active', cat.id)"
    >
      {{ cat.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.filter-bar::-webkit-scrollbar {
  display: none;
}

.filter-pill {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.35rem 0.75rem;
  border: 2px solid var(--border);
  border-radius: 99px;
  background: transparent;
  color: var(--text-light);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.filter-pill:hover {
  background: var(--accent-light);
  color: var(--text);
}

.filter-pill.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
</style>
