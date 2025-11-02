<template>
  <div class="image-editor-container">
    <div class="editor-header">
      <h1>🎨 Funny Image Editor</h1>
      <p>Make hilarious memes and silly edits</p>
    </div>

    <div class="editor-main">
      <div class="canvas-wrapper">
        <div v-if="!imageLoaded" class="upload-prompt">
          <p>📸 Upload an image to start editing!</p>
        </div>
        <div v-if="imageLoaded" class="tool-indicator">
          {{ toolStatus }}
        </div>
        <canvas
          ref="canvas"
          class="editor-canvas"
          @mousedown="handleCanvasClick"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
        ></canvas>
      </div>

      <div class="editor-sidebar">
        <div class="controls-section">
          <h3>Upload Image</h3>
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="file-input"
          >
          <div v-if="imageLoaded" class="button-row">
            <button class="reset-btn" @click="resetImage">
              🔄 Reset
            </button>
            <button class="reset-btn" @click="undo" title="Undo last action">
              ↶ Undo
            </button>
          </div>
        </div>

        <FunnyEffects
          ref="funnyEffects"
          :sticker-size="stickerSize"
          @apply-effect="applyEffect"
          @add-text="addTextToImage"
          @update:sticker-size="stickerSize = $event"
        />

        <StickerLibrary
          @add-sticker="addSticker"
        />

        <ExportPanel
          @download="downloadImage"
          @copy-clipboard="copyToClipboard"
          @generate-share="generateShareLink"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, computed } from 'vue'
import FunnyEffects from '../components/FunnyEffects.vue'
import StickerLibrary from '../components/StickerLibrary.vue'
import ExportPanel from '../components/ExportPanel.vue'

export default {
  name: 'ImageEditor',
  components: {
    FunnyEffects,
    StickerLibrary,
    ExportPanel
  },
  setup() {
    const canvas = ref(null)
    const imageLoaded = ref(false)
    const originalImageData = ref(null)
    const isDrawing = ref(false)
    const currentTool = ref('draw')
    const pendingSticker = ref(null)
    const stickerSize = ref(120)
    const history = ref([])
    const historyIndex = ref(-1)

    const saveToHistory = () => {
      if (!canvas.value) return
      const ctx = canvas.value.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)

      // Remove any future history if we're not at the end
      history.value = history.value.slice(0, historyIndex.value + 1)

      history.value.push(imageData)
      historyIndex.value = history.value.length - 1
    }

    const undo = () => {
      if (historyIndex.value > 0) {
        historyIndex.value--
        const ctx = canvas.value.getContext('2d')
        ctx.putImageData(history.value[historyIndex.value], 0, 0)
      }
    }

    const handleImageUpload = (event) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            nextTick(() => {
              const ctx = canvas.value.getContext('2d')
              canvas.value.width = img.width
              canvas.value.height = img.height
              ctx.drawImage(img, 0, 0)
              originalImageData.value = ctx.getImageData(0, 0, img.width, img.height)
              imageLoaded.value = true

              // Save initial state to history
              history.value = []
              historyIndex.value = -1
              saveToHistory()
            })
          }
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const resetImage = () => {
      if (originalImageData.value && canvas.value) {
        const ctx = canvas.value.getContext('2d')
        // Create a fresh copy of original data
        const freshCopy = new ImageData(
          new Uint8ClampedArray(originalImageData.value.data),
          originalImageData.value.width,
          originalImageData.value.height
        )
        ctx.putImageData(freshCopy, 0, 0)
      }
    }

    const handleCanvasClick = (e) => {
      if (!imageLoaded.value) return

      if (pendingSticker.value) {
        addStickerAtPosition(e)
        pendingSticker.value = null
        currentTool.value = 'draw'
      } else if (currentTool.value === 'text') {
        addTextAtPosition(e)
        currentTool.value = 'draw'
      } else if (currentTool.value === 'draw') {
        isDrawing.value = true
      }
    }

    const pendingText = ref(null)

    const addTextAtPosition = (e) => {
      if (!imageLoaded.value || !canvas.value || !pendingText.value) return
      const ctx = canvas.value.getContext('2d')
      const rect = canvas.value.getBoundingClientRect()

      // Calculate position relative to canvas with proper scaling
      const scaleX = canvas.value.width / rect.width
      const scaleY = canvas.value.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      ctx.font = `bold ${pendingText.value.fontSize}px Arial`
      ctx.fillStyle = pendingText.value.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 3

      ctx.strokeText(pendingText.value.text, x, y)
      ctx.fillText(pendingText.value.text, x, y)

      pendingText.value = null
      saveToHistory()
    }

    const addStickerAtPosition = (e) => {
      if (!imageLoaded.value || !canvas.value) return
      const ctx = canvas.value.getContext('2d')
      const rect = canvas.value.getBoundingClientRect()

      // Calculate position relative to canvas with proper scaling
      const scaleX = canvas.value.width / rect.width
      const scaleY = canvas.value.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      // Use stickerSize ref for dynamic sizing
      ctx.font = `bold ${stickerSize.value}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(pendingSticker.value, x, y)

      saveToHistory()
    }

    const startDrawing = (e) => {
      if (!imageLoaded.value) return
      isDrawing.value = true
    }

    const draw = (e) => {
      if (!isDrawing.value || !imageLoaded.value) return
      const ctx = canvas.value.getContext('2d')
      const rect = canvas.value.getBoundingClientRect()

      // Calculate position relative to canvas with proper scaling
      const scaleX = canvas.value.width / rect.width
      const scaleY = canvas.value.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      ctx.fillStyle = '#ff0000'
      ctx.fillRect(x - 3, y - 3, 6, 6)
    }

    const stopDrawing = () => {
      isDrawing.value = false
    }

    const applyEffect = (effectType) => {
      if (!imageLoaded.value || !canvas.value) return
      const ctx = canvas.value.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
      const data = imageData.data

      switch(effectType) {
        case 'big-eyes':
          applyBigEyesEffect(data)
          break
        case 'tiny-mouth':
          applyTinyMouthEffect(data)
          break
        case 'invert':
          applyInvertEffect(data)
          break
        case 'grayscale':
          applyGrayscaleEffect(data)
          break
        case 'sepia':
          applySepiaEffect(data)
          break
      }
      ctx.putImageData(imageData, 0, 0)
      saveToHistory()
    }

    const applyBigEyesEffect = (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + 30)
        data[i + 1] = Math.min(255, data[i + 1] + 30)
        data[i + 2] = Math.min(255, data[i + 2] + 30)
      }
    }

    const applyTinyMouthEffect = (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, data[i] - 20)
      }
    }

    const applyInvertEffect = (data) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]
        data[i + 1] = 255 - data[i + 1]
        data[i + 2] = 255 - data[i + 2]
      }
    }

    const applyGrayscaleEffect = (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        data[i] = gray
        data[i + 1] = gray
        data[i + 2] = gray
      }
    }

    const applySepiaEffect = (data) => {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
      }
    }

    const addTextToImage = (textData) => {
      if (!imageLoaded.value) return
      // Set pending text and switch to text tool
      pendingText.value = textData
      currentTool.value = 'text'
    }

    const addSticker = (stickerEmoji) => {
      if (!imageLoaded.value) return
      pendingSticker.value = stickerEmoji
      currentTool.value = 'sticker'
    }

    const downloadImage = () => {
      if (!imageLoaded.value || !canvas.value) return
      const link = document.createElement('a')
      link.href = canvas.value.toDataURL('image/png')
      link.download = `funny-meme-${Date.now()}.png`
      link.click()
    }

    const copyToClipboard = async () => {
      if (!imageLoaded.value || !canvas.value) return
      try {
        canvas.value.toBlob((blob) => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob })
            navigator.clipboard.write([item]).then(() => {
              alert('✅ Image copied to clipboard! Paste it anywhere.')
            }).catch((err) => {
              console.error('Clipboard write error:', err)
              alert('⚠️ Copy failed. Try right-clicking the image to save.')
            })
          }
        }, 'image/png')
      } catch (err) {
        alert('Failed to copy to clipboard')
        console.error(err)
      }
    }

    const generateShareLink = () => {
      if (!imageLoaded.value || !canvas.value) return
      const dataUrl = canvas.value.toDataURL('image/png')

      const shareId = `share-${Date.now()}`
      localStorage.setItem(shareId, dataUrl)

      // Use production URL (playground.dizid.com) or current origin
      const baseUrl = window.location.hostname === 'localhost'
        ? 'https://playground.dizid.com'
        : window.location.origin

      const shareUrl = `${baseUrl}/image-editor?share=${shareId}`

      navigator.clipboard.writeText(shareUrl).then(() => {
        alert(`✅ Share link copied!\n\n${shareUrl}`)
      }).catch(() => {
        alert(`Share link:\n${shareUrl}`)
      })
    }

    const toolStatus = computed(() => {
      if (currentTool.value === 'sticker') {
        return '👆 Click canvas to place sticker'
      } else if (currentTool.value === 'text') {
        return '👆 Click canvas to place text'
      } else if (currentTool.value === 'draw') {
        return '✏️ Draw'
      }
      return 'Ready'
    })

    return {
      canvas,
      imageLoaded,
      currentTool,
      pendingSticker,
      pendingText,
      stickerSize,
      toolStatus,
      handleImageUpload,
      resetImage,
      handleCanvasClick,
      draw,
      stopDrawing,
      applyEffect,
      addTextToImage,
      addSticker,
      downloadImage,
      copyToClipboard,
      generateShareLink,
      undo
    }
  }
}
</script>

<style scoped>
.image-editor-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #eee;
  padding: 20px;
}

.editor-header {
  text-align: center;
  margin-bottom: 30px;
}

.editor-header h1 {
  font-size: 2.5rem;
  margin: 10px 0;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.editor-header p {
  font-size: 1.1rem;
  color: #aaa;
}

.editor-main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.canvas-wrapper {
  background: #0f3460;
  border-radius: 12px;
  padding: 20px;
  min-height: 500px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.upload-prompt {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
}

.tool-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ff6b6b;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  z-index: 10;
  text-transform: uppercase;
}

.editor-canvas {
  max-width: 100%;
  max-height: 600px;
  border: 2px solid #ff6b6b;
  border-radius: 8px;
  cursor: crosshair;
  background: white;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.reset-btn {
  padding: 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8c42 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.editor-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.controls-section {
  background: #16213e;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #0f3460;
}

.controls-section h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #ffd93d;
}

.file-input {
  width: 100%;
  padding: 8px;
  border: 2px dashed #ff6b6b;
  border-radius: 6px;
  background: #0f3460;
  color: #eee;
  cursor: pointer;
  font-size: 0.9rem;
}

.file-input::file-selector-button {
  padding: 6px 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

/* Responsive design */
@media (max-width: 1024px) {
  .editor-main {
    grid-template-columns: 1fr;
  }

  .editor-sidebar {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .editor-header h1 {
    font-size: 1.8rem;
  }

  .canvas-wrapper {
    min-height: 300px;
  }
}
</style>
