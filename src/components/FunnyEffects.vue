<template>
  <div class="funny-effects">
    <h3>🤪 Funny Effects</h3>

    <!-- Collapsible sections -->
    <div class="effect-group collapsible">
      <button class="section-toggle" @click="toggleSection('distortion')">
        <span class="toggle-icon">{{ openSections.distortion ? '▼' : '▶' }}</span>
        <h4>Face Distortion</h4>
      </button>
      <div v-if="openSections.distortion" class="button-group">
        <button class="effect-btn" @click="$emit('apply-effect', 'big-eyes')" title="Make eyes big and bright!">
          👀 Big Eyes
        </button>
        <button class="effect-btn" @click="$emit('apply-effect', 'tiny-mouth')" title="Tiny mouth effect">
          👄 Tiny Mouth
        </button>
      </div>
    </div>

    <div class="effect-group collapsible">
      <button class="section-toggle" @click="toggleSection('adjustments')">
        <span class="toggle-icon">{{ openSections.adjustments ? '▼' : '▶' }}</span>
        <h4>Adjustments</h4>
      </button>
      <div v-if="openSections.adjustments" class="text-options">
        <label>
          Brightness:
          <input v-model.number="brightness" type="range" min="-100" max="100" class="slider" @change="updateSliderEffect('brightness')">
          <span>{{ brightness }}</span>
        </label>
        <label>
          Contrast:
          <input v-model.number="contrast" type="range" min="-100" max="100" class="slider" @change="updateSliderEffect('contrast')">
          <span>{{ contrast }}</span>
        </label>
        <label>
          Saturation:
          <input v-model.number="saturation" type="range" min="-100" max="100" class="slider" @change="updateSliderEffect('saturation')">
          <span>{{ saturation }}</span>
        </label>
      </div>
    </div>

    <div class="effect-group collapsible">
      <button class="section-toggle" @click="toggleSection('filters')">
        <span class="toggle-icon">{{ openSections.filters ? '▼' : '▶' }}</span>
        <h4>Color Filters</h4>
      </button>
      <div v-if="openSections.filters" class="button-group">
        <button class="effect-btn" @click="$emit('apply-effect', 'invert')" title="Invert colors">
          🔄 Invert
        </button>
        <button class="effect-btn" @click="$emit('apply-effect', 'grayscale')" title="Black & white">
          ⚫ B&W
        </button>
        <button class="effect-btn" @click="$emit('apply-effect', 'sepia')" title="Vintage sepia tone">
          📸 Sepia
        </button>
        <button class="effect-btn" @click="$emit('apply-effect', 'blur')" title="Blur effect">
          💨 Blur
        </button>
        <button class="effect-btn" @click="$emit('apply-effect', 'pixelate')" title="Pixelate effect">
          ⬜ Pixelate
        </button>
      </div>
    </div>

    <div class="effect-group collapsible">
      <button class="section-toggle" @click="toggleSection('transforms')">
        <span class="toggle-icon">{{ openSections.transforms ? '▼' : '▶' }}</span>
        <h4>Transforms</h4>
      </button>
      <div v-if="openSections.transforms" class="button-group">
        <button class="effect-btn" @click="$emit('apply-effect', 'flip-h')" title="Flip horizontally">
          ↔️ Flip H
        </button>
        <button class="effect-btn" @click="$emit('apply-effect', 'flip-v')" title="Flip vertically">
          ↕️ Flip V
        </button>
      </div>
    </div>

    <div class="effect-group collapsible">
      <button class="section-toggle" @click="toggleSection('presets')">
        <span class="toggle-icon">{{ openSections.presets ? '▼' : '▶' }}</span>
        <h4>Presets</h4>
      </button>
      <div v-if="openSections.presets" class="button-group">
        <button class="effect-btn preset" @click="applyPreset('vintage')" title="Vintage look">
          🎬 Vintage
        </button>
        <button class="effect-btn preset" @click="applyPreset('cool')" title="Cool filter">
          ❄️ Cool
        </button>
        <button class="effect-btn preset" @click="applyPreset('warm')" title="Warm filter">
          🔥 Warm
        </button>
        <button class="effect-btn preset" @click="applyPreset('vivid')" title="Vivid colors">
          🌈 Vivid
        </button>
      </div>
    </div>

    <div class="effect-group collapsible">
      <button class="section-toggle" @click="toggleSection('text')">
        <span class="toggle-icon">{{ openSections.text ? '▼' : '▶' }}</span>
        <h4>Text Tools</h4>
      </button>
      <div v-if="openSections.text">
        <div class="text-control">
          <input
            v-model="textContent"
            type="text"
            placeholder="Enter text..."
            class="text-input"
            @keyup.enter="addTextToImage"
          >
          <button class="effect-btn" @click="addTextToImage">
            ✏️ Add
          </button>
        </div>
        <div class="text-options">
          <label>
            Font:
            <select v-model="textFont" class="font-select">
              <option value="Arial, sans-serif">Arial</option>
              <option value="Impact, sans-serif">Impact</option>
              <option value="'Comic Sans MS', cursive">Comic Sans</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </label>
          <label>
            Size:
            <input v-model.number="fontSize" type="range" min="8" max="150" class="slider">
            <span>{{ fontSize }}px</span>
          </label>
          <label>
            Color:
            <input v-model="textColor" type="color" class="color-picker">
          </label>
          <label>
            <input v-model="textBold" type="checkbox"> Bold
          </label>
          <label>
            <input v-model="textOutline" type="checkbox"> Outline
          </label>
          <label>
            Outline Color:
            <input v-model="textOutlineColor" type="color" class="color-picker">
          </label>
        </div>
      </div>
    </div>

    <div class="effect-group collapsible">
      <button class="section-toggle" @click="toggleSection('stickers')">
        <span class="toggle-icon">{{ openSections.stickers ? '▼' : '▶' }}</span>
        <h4>Sticker Size</h4>
      </button>
      <div v-if="openSections.stickers" class="text-options">
        <label>
          Size:
          <input :value="stickerSize" type="range" min="40" max="300" class="slider" @change="$emit('update:stickerSize', +$event.target.value)">
          <span>{{ stickerSize }}px</span>
        </label>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FunnyEffects',
  props: {
    stickerSize: {
      type: Number,
      default: 80
    },
    defaultTextSize: {
      type: Number,
      default: 32
    }
  },
  emits: ['apply-effect', 'add-text', 'update:stickerSize'],
  setup(props, { emit }) {
    const textContent = ref('')
    const fontSize = ref(props.defaultTextSize)
    const textColor = ref('#ff0000')
    const textFont = ref('Arial, sans-serif')
    const textBold = ref(false)
    const textOutline = ref(false)
    const textOutlineColor = ref('#000000')

    const brightness = ref(0)
    const contrast = ref(0)
    const saturation = ref(0)

    const openSections = ref({
      distortion: true,
      adjustments: false,
      filters: false,
      transforms: false,
      presets: false,
      stickers: false,
      text: false
    })

    const toggleSection = (section) => {
      openSections.value[section] = !openSections.value[section]
    }

    const addTextToImage = () => {
      if (textContent.value) {
        emit('add-text', {
          text: textContent.value,
          fontSize: fontSize.value,
          color: textColor.value,
          font: textFont.value,
          bold: textBold.value,
          outline: textOutline.value,
          outlineColor: textOutlineColor.value
        })
        textContent.value = ''
      }
    }

    const updateSliderEffect = (effectType) => {
      switch(effectType) {
        case 'brightness':
          emit('apply-effect', { type: 'brightness', value: brightness.value })
          break
        case 'contrast':
          emit('apply-effect', { type: 'contrast', value: contrast.value })
          break
        case 'saturation':
          emit('apply-effect', { type: 'saturation', value: saturation.value })
          break
      }
    }

    const applyPreset = (presetName) => {
      const presets = {
        vintage: { saturation: -20, contrast: 20, brightness: 10 },
        cool: { saturation: 10, contrast: 15, brightness: -5 },
        warm: { saturation: 15, contrast: 10, brightness: 15 },
        vivid: { saturation: 50, contrast: 30, brightness: 5 }
      }

      const preset = presets[presetName]
      if (preset) {
        saturation.value = preset.saturation
        contrast.value = preset.contrast
        brightness.value = preset.brightness
        // Emit with preset data so it can be applied
        emit('apply-effect', {
          type: 'preset',
          name: presetName,
          saturation: preset.saturation,
          contrast: preset.contrast,
          brightness: preset.brightness,
          value: preset
        })
      }
    }

    const randomEffect = () => {
      const effects = [
        'big-eyes',
        'tiny-mouth',
        'invert',
        'grayscale',
        'sepia',
        'blur',
        'pixelate'
      ]
      const randomEffect = effects[Math.floor(Math.random() * effects.length)]
      emit('apply-effect', randomEffect)
    }

    return {
      textContent,
      fontSize,
      textColor,
      textFont,
      textBold,
      textOutline,
      textOutlineColor,
      brightness,
      contrast,
      saturation,
      openSections,
      toggleSection,
      addTextToImage,
      updateSliderEffect,
      applyPreset,
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
  margin-bottom: 12px;
  padding-bottom: 0;
  border-bottom: none;
}

.effect-group.collapsible {
  border: 1px solid #0f3460;
  border-radius: 6px;
  padding: 0;
  margin-bottom: 10px;
}

.section-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  color: #ffd93d;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-align: left;
}

.section-toggle:hover {
  background: linear-gradient(135deg, #1a3a52 0%, #1a2a42 100%);
}

.section-toggle h4 {
  margin: 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
}

.toggle-icon {
  display: inline-flex;
  align-items: center;
  font-size: 0.8rem;
  min-width: 12px;
}

.effect-group.collapsible > div {
  padding: 12px;
  border-top: 1px solid #0f3460;
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

.effect-btn.preset {
  border-color: #4ecdc4;
}

.effect-btn.preset:hover {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
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
  gap: 10px;
  font-size: 0.8rem;
}

.text-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #aaa;
}

.text-options input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.font-select {
  flex: 1;
  padding: 6px;
  background: #0f3460;
  border: 2px solid #ff6b6b;
  border-radius: 4px;
  color: #eee;
  font-size: 0.85rem;
  cursor: pointer;
}

.font-select:focus {
  outline: none;
  border-color: #ffd93d;
  box-shadow: 0 0 8px rgba(255, 217, 61, 0.3);
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
  min-width: 45px;
  text-align: right;
}
</style>
