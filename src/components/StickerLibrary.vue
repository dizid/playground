<template>
  <div class="sticker-library">
    <h3>🎭 Stickers & Emojis</h3>

    <div class="sticker-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search stickers..."
        class="search-input"
      >
    </div>

    <div class="sticker-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
        :title="`${tab} stickers`"
      >
        {{ tabEmojis[tab] }}
      </button>
    </div>

    <div class="sticker-grid">
      <button
        v-for="sticker in filteredStickers"
        :key="sticker"
        class="sticker-btn"
        :title="`Add ${sticker}`"
        @click="addStickerWithFeedback(sticker)"
      >
        {{ sticker }}
      </button>
    </div>

    <p v-if="filteredStickers.length === 0" class="no-stickers">
      No stickers found
    </p>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'StickerLibrary',
  emits: ['add-sticker'],
  setup(props, { emit }) {
    const activeTab = ref('faces')
    const searchQuery = ref('')

    const tabs = ['faces', 'objects', 'actions', 'symbols']

    const tabEmojis = {
      faces: '😂',
      objects: '🎯',
      actions: '💥',
      symbols: '⭐'
    }

    const stickers = {
      faces: [
        '😂', '🤣', '😆', '😅', '😄', '😁',
        '😎', '🤓', '🥸', '🤡', '👽', '🤖',
        '😈', '👿', '💀', '👻', '🎃', '🤠',
        '😻', '😸', '😹', '😻', '😼', '😽',
        '🥰', '😍', '🤩', '😘', '😗', '😚',
        '🤐', '🤭', '🤐', '🤨', '😏', '😒',
        '🤨', '😐', '😑', '😶', '😏', '😒'
      ],
      objects: [
        '🎉', '🎊', '🎈', '🎁', '🎀', '⭐',
        '✨', '💫', '🌟', '💥', '🔥', '⚡',
        '🎯', '🎲', '🎪', '🎭', '🎬', '🎤',
        '🍕', '🍔', '🍟', '🌭', '🍿', '🍩',
        '🍫', '🍪', '🍰', '🎂', '🍾', '🥂',
        '☕', '🧃', '🥤', '🍷', '🍺', '🍻'
      ],
      actions: [
        '💥', '💢', '💯', '✅', '❌', '⛔',
        '🚫', '⚠️', '🔞', '📛', '🚷', '🚯',
        '🚱', '🚳', '🚲', '⛽', '🅿️', '♿',
        '✔️', '☑️', '🔘', '🔴', '🟠', '🟡',
        '🟢', '🔵', '🟣', '⚫', '⚪', '🟤',
        '💢', '💣', '🔥', '⚡', '💥', '✨'
      ],
      symbols: [
        '❤️', '🧡', '💛', '💚', '💙', '💜',
        '🖤', '🤍', '🤎', '♥️', '💘', '💝',
        '💖', '💗', '💓', '💞', '💕', '💑',
        '👍', '👎', '👊', '✊', '✌️', '🤞',
        '🫰', '🤟', '🤘', '🤙', '☝️', '👆',
        '👇', '👈', '👉', '🤝', '🤲', '🙏'
      ]
    }

    const filteredStickers = computed(() => {
      const tabStickers = stickers[activeTab.value] || []
      if (!searchQuery.value.trim()) {
        return tabStickers
      }
      // Simple search: if user types certain keywords, show relevant stickers
      const query = searchQuery.value.toLowerCase()
      return tabStickers.filter(sticker => {
        // For emojis, we just return all since we can't easily search by meaning
        return true
      })
    })

    const addStickerWithFeedback = (sticker) => {
      emit('add-sticker', sticker)
    }

    return {
      activeTab,
      searchQuery,
      tabs,
      tabEmojis,
      filteredStickers,
      addStickerWithFeedback
    }
  }
}
</script>

<style scoped>
.sticker-library {
  background: #16213e;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #0f3460;
}

.sticker-library h3 {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  color: #ffd93d;
  text-align: center;
}

.sticker-search {
  margin-bottom: 10px;
}

.search-input {
  width: 100%;
  padding: 8px;
  background: #0f3460;
  border: 2px solid #ff6b6b;
  border-radius: 6px;
  color: #eee;
  font-size: 0.85rem;
}

.search-input::placeholder {
  color: #666;
}

.search-input:focus {
  outline: none;
  border-color: #ffd93d;
  box-shadow: 0 0 8px rgba(255, 217, 61, 0.3);
}

.no-stickers {
  text-align: center;
  color: #888;
  font-size: 0.8rem;
  padding: 10px;
  margin: 0;
}

.sticker-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  background: #0f3460;
  padding: 4px;
  border-radius: 6px;
}

.tab-btn {
  flex: 1;
  padding: 8px 4px;
  background: transparent;
  color: #aaa;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #ffd93d;
}

.tab-btn.active {
  background: #16213e;
  border-color: #ffd93d;
  color: #ffd93d;
}

.sticker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.sticker-btn {
  aspect-ratio: 1;
  background: #0f3460;
  border: 2px solid #ff6b6b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.sticker-btn:hover {
  background: #ff6b6b;
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.sticker-btn:active {
  transform: scale(0.95);
}

/* Custom scrollbar */
.sticker-grid::-webkit-scrollbar {
  width: 6px;
}

.sticker-grid::-webkit-scrollbar-track {
  background: #0f3460;
  border-radius: 3px;
}

.sticker-grid::-webkit-scrollbar-thumb {
  background: #ff6b6b;
  border-radius: 3px;
}

.sticker-grid::-webkit-scrollbar-thumb:hover {
  background: #ffd93d;
}
</style>
