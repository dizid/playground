<template>
  <div class="funny-effects">
    <h3>🤪 Funny Effects</h3>

    <div class="effect-group">
      <h4>Face Distortion</h4>
      <div class="button-group">
        <button
          class="effect-btn"
          @click="$emit('apply-effect', 'big-eyes')"
          title="Make eyes big and bright!"
        >
          👀 Big Eyes
        </button>
        <button
          class="effect-btn"
          @click="$emit('apply-effect', 'tiny-mouth')"
          title="Tiny mouth effect"
        >
          👄 Tiny Mouth
        </button>
      </div>
    </div>

    <div class="effect-group">
      <h4>Color Effects</h4>
      <div class="button-group">
        <button
          class="effect-btn"
          @click="$emit('apply-effect', 'invert')"
          title="Invert colors"
        >
          🔄 Invert
        </button>
        <button
          class="effect-btn"
          @click="$emit('apply-effect', 'grayscale')"
          title="Black & white"
        >
          ⚫ B&W
        </button>
        <button
          class="effect-btn"
          @click="$emit('apply-effect', 'sepia')"
          title="Vintage sepia tone"
        >
          📸 Sepia
        </button>
      </div>
    </div>

    <div class="effect-group">
      <h4>Text Tools</h4>
      <div class="text-control">
        <input
          v-model="textContent"
          type="text"
          placeholder="Enter funny text..."
          class="text-input"
          @keyup.enter="addTextToImage"
        >
        <button
          class="effect-btn"
          @click="addTextToImage"
        >
          ✏️ Add Text
        </button>
      </div>
      <div class="text-options">
        <label>
          Font Size:
          <input v-model.number="fontSize" type="range" min="10" max="100" class="slider">
          <span>{{ fontSize }}px</span>
        </label>
        <label>
          Color:
          <input v-model="textColor" type="color" class="color-picker">
        </label>
      </div>
    </div>

    <div class="effect-group">
      <h4>More Fun</h4>
      <div class="button-group">
        <button
          class="effect-btn fun"
          @click="randomEffect"
          title="Apply random effect!"
        >
          🎲 Random!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FunnyEffects',
  emits: ['apply-effect', 'add-text'],
  setup(props, { emit }) {
    const textContent = ref('')
    const fontSize = ref(40)
    const textColor = ref('#ff0000')

    const addTextToImage = () => {
      if (textContent.value) {
        emit('add-text', {
          text: textContent.value,
          fontSize: fontSize.value,
          color: textColor.value
        })
        textContent.value = ''
      }
    }

    const randomEffect = () => {
      const effects = [
        'big-eyes',
        'tiny-mouth',
        'invert',
        'grayscale',
        'sepia'
      ]
      const randomEffect = effects[Math.floor(Math.random() * effects.length)]
      emit('apply-effect', randomEffect)
    }

    return {
      textContent,
      fontSize,
      textColor,
      addTextToImage,
      randomEffect
    }
  }
}
</script>

<style scoped>
.funny-effects {
  background: #16213e;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #0f3460;
}

.funny-effects h3 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #ffd93d;
  text-align: center;
}

.effect-group {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #0f3460;
}

.effect-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.effect-group h4 {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: #ff6b6b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.effect-btn {
  padding: 8px 10px;
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  color: #eee;
  border: 2px solid #ff6b6b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.effect-btn:hover {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8c42 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.effect-btn.fun {
  background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%);
  color: #1a1a2e;
  border-color: #ffd93d;
  font-size: 0.9rem;
  font-weight: 900;
}

.effect-btn.fun:hover {
  box-shadow: 0 4px 16px rgba(255, 217, 61, 0.5);
}

.text-control {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.text-input {
  flex: 1;
  padding: 8px;
  background: #0f3460;
  border: 2px solid #ff6b6b;
  border-radius: 6px;
  color: #eee;
  font-size: 0.85rem;
}

.text-input::placeholder {
  color: #666;
}

.text-input:focus {
  outline: none;
  border-color: #ffd93d;
  box-shadow: 0 0 8px rgba(255, 217, 61, 0.3);
}

.text-control .effect-btn {
  padding: 8px 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.text-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.8rem;
}

.text-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #aaa;
}

.slider {
  flex: 1;
  height: 4px;
  cursor: pointer;
}

.color-picker {
  width: 40px;
  height: 28px;
  border: 2px solid #ff6b6b;
  border-radius: 4px;
  cursor: pointer;
}

.text-options span {
  color: #ffd93d;
  font-weight: bold;
  min-width: 35px;
}
</style>
