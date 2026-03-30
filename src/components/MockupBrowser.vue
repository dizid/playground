<script setup>
defineProps({
  url: { type: String, default: '' },
})
</script>

<template>
  <div class="browser">
    <div class="browser-bar">
      <div class="dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <span class="browser-url" v-if="url">{{ url.replace(/^https?:\/\//, '').replace(/\/$/, '') }}</span>
    </div>
    <div class="browser-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.browser {
  border: 2px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--brand-bg, #111);
}

.browser-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid var(--border);
}

.dots {
  display: flex;
  gap: 5px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green { background: #28c840; }

.browser-url {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.6rem;
  color: var(--text-light);
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.browser-content {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  position: relative;
}
</style>
