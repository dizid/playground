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
            <button class="reset-btn" @click="resetImage" title="Reset image">
              🔄 Reset
            </button>
            <button class="reset-btn" @click="undo" title="Undo last action (Ctrl+Z)">
              ↶ Undo
            </button>
          </div>
        </div>

        <div v-if="imageLoaded" class="controls-section">
          <h3>🎨 Drawing Tools</h3>
          <div class="text-options">
            <label>
              Brush Color:
              <input v-model="brushColor" type="color" class="color-picker">
              <span class="color-preview" :style="{ backgroundColor: brushColor }"></span>
            </label>
            <label>
              Brush Size:
              <input v-model.number="brushSize" type="range" min="1" max="50" class="slider">
              <span>{{ brushSize }}px</span>
            </label>
            <div class="brush-preview">
              <svg width="60" height="40" style="border: 1px solid #666; border-radius: 4px; background: #0f3460;">
                <circle :cx="30" :cy="20" :r="brushSize / 2" :fill="brushColor" />
              </svg>
            </div>
          </div>
        </div>

        <div v-if="imageLoaded" class="controls-section">
          <h3>🔍 Canvas Controls</h3>
          <div class="text-options">
            <label>
              Zoom:
              <input v-model.number="zoomLevel" type="range" min="50" max="200" step="10" class="slider">
              <span>{{ zoomLevel }}%</span>
            </label>
            <label>
              <input v-model="showGrid" type="checkbox"> Show Grid
            </label>
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
    const brushColor = ref('#ff0000')
    const brushSize = ref(3)
    const zoomLevel = ref(100)
    const showGrid = ref(false)
    const canvasScale = ref(1)

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

      const fontWeight = pendingText.value.bold ? 'bold' : 'normal'
      ctx.font = `${fontWeight} ${pendingText.value.fontSize}px ${pendingText.value.font || 'Arial'}`
      ctx.fillStyle = pendingText.value.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (pendingText.value.outline) {
        ctx.strokeStyle = pendingText.value.outlineColor
        ctx.lineWidth = 4
        ctx.strokeText(pendingText.value.text, x, y)
      } else {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.strokeText(pendingText.value.text, x, y)
      }

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

      ctx.fillStyle = brushColor.value
      const radius = brushSize.value / 2
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const stopDrawing = () => {
      isDrawing.value = false
    }

    const applyEffect = (effectInput) => {
      if (!imageLoaded.value || !canvas.value) return
      const ctx = canvas.value.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
      const data = imageData.data

      // Handle both string and object inputs
      const effectType = typeof effectInput === 'string' ? effectInput : effectInput.type
      const effectValue = typeof effectInput === 'object' ? effectInput.value : null

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
        case 'blur':
          applyBlurEffect(imageData)
          break
        case 'pixelate':
          applyPixelateEffect(imageData)
          break
        case 'brightness':
          applyBrightnessEffect(data, effectValue)
          break
        case 'contrast':
          applyContrastEffect(data, effectValue)
          break
        case 'saturation':
          applySaturationEffect(data, effectValue)
          break
        case 'flip-h':
          ctx.putImageData(imageData, 0, 0)
          applyFlipHorizontal()
          saveToHistory()
          return
        case 'flip-v':
          ctx.putImageData(imageData, 0, 0)
          applyFlipVertical()
          saveToHistory()
          return
        case 'rotation':
          ctx.putImageData(imageData, 0, 0)
          applyRotation(effectValue)
          saveToHistory()
          return
        case 'preset':
          // Apply preset - brightness, contrast, saturation in order
          applyBrightnessEffect(data, effectValue.brightness)
          applyContrastEffect(data, effectValue.contrast)
          applySaturationEffect(data, effectValue.saturation)
          break
      }

      if (effectType !== 'flip-h' && effectType !== 'flip-v' && effectType !== 'rotation') {
        ctx.putImageData(imageData, 0, 0)
      }
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

    const applyBlurEffect = (imageData) => {
      const data = imageData.data
      const width = canvas.value.width
      const height = canvas.value.height
      const blurRadius = 3

      // Simple box blur
      const tempData = new Uint8ClampedArray(data)
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          let r = 0, g = 0, b = 0, a = 0, count = 0

          for (let y = -blurRadius; y <= blurRadius; y++) {
            for (let x = -blurRadius; x <= blurRadius; x++) {
              const px = Math.min(Math.max(j + x, 0), width - 1)
              const py = Math.min(Math.max(i + y, 0), height - 1)
              const idx = (py * width + px) * 4

              r += tempData[idx]
              g += tempData[idx + 1]
              b += tempData[idx + 2]
              a += tempData[idx + 3]
              count++
            }
          }

          const idx = (i * width + j) * 4
          data[idx] = Math.round(r / count)
          data[idx + 1] = Math.round(g / count)
          data[idx + 2] = Math.round(b / count)
          data[idx + 3] = Math.round(a / count)
        }
      }
    }

    const applyPixelateEffect = (imageData) => {
      const data = imageData.data
      const width = canvas.value.width
      const height = canvas.value.height
      const pixelSize = 10

      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          let r = 0, g = 0, b = 0, a = 0

          // Sample first pixel in block
          const idx = (y * width + x) * 4
          r = data[idx]
          g = data[idx + 1]
          b = data[idx + 2]
          a = data[idx + 3]

          // Fill entire block with sampled color
          for (let py = y; py < Math.min(y + pixelSize, height); py++) {
            for (let px = x; px < Math.min(x + pixelSize, width); px++) {
              const pidx = (py * width + px) * 4
              data[pidx] = r
              data[pidx + 1] = g
              data[pidx + 2] = b
              data[pidx + 3] = a
            }
          }
        }
      }
    }

    const applyBrightnessEffect = (data, value) => {
      const brightness = Math.round(value * 2.55)
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + brightness))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness))
      }
    }

    const applyContrastEffect = (data, value) => {
      const contrast = (value + 100) / 100
      const intercept = 128 * (1 - contrast)
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] * contrast + intercept))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrast + intercept))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrast + intercept))
      }
    }

    const applySaturationEffect = (data, value) => {
      const saturation = (value + 100) / 100
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const gray = 0.299 * r + 0.587 * g + 0.114 * b

        data[i] = Math.min(255, Math.max(0, gray + (r - gray) * saturation))
        data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * saturation))
        data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * saturation))
      }
    }

    const applyFlipHorizontal = () => {
      if (!canvas.value) return
      const ctx = canvas.value.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
      const data = imageData.data
      const width = canvas.value.width
      const height = canvas.value.height

      // Flip pixels horizontally
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width / 2; x++) {
          const idx1 = (y * width + x) * 4
          const idx2 = (y * width + (width - 1 - x)) * 4

          // Swap pixels
          for (let c = 0; c < 4; c++) {
            const temp = data[idx1 + c]
            data[idx1 + c] = data[idx2 + c]
            data[idx2 + c] = temp
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const applyFlipVertical = () => {
      if (!canvas.value) return
      const ctx = canvas.value.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
      const data = imageData.data
      const width = canvas.value.width
      const height = canvas.value.height

      // Flip pixels vertically
      for (let y = 0; y < height / 2; y++) {
        for (let x = 0; x < width; x++) {
          const idx1 = (y * width + x) * 4
          const idx2 = ((height - 1 - y) * width + x) * 4

          // Swap pixels
          for (let c = 0; c < 4; c++) {
            const temp = data[idx1 + c]
            data[idx1 + c] = data[idx2 + c]
            data[idx2 + c] = temp
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const applyRotation = (angle) => {
      if (!canvas.value || angle === 0) return
      const ctx = canvas.value.getContext('2d')

      // For 90, 180, 270 degree rotations, we need to handle canvas resizing for 90/270
      const radians = (angle * Math.PI) / 180
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)

      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
      const width = canvas.value.width
      const height = canvas.value.height

      if (angle === 90 || angle === 270) {
        // Swap width and height for 90/270 rotations
        canvas.value.width = height
        canvas.value.height = width
      }

      // Clear and redraw
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.save()

      if (angle === 90) {
        ctx.translate(height, 0)
        ctx.rotate((90 * Math.PI) / 180)
      } else if (angle === 180) {
        ctx.translate(width, height)
        ctx.rotate(Math.PI)
      } else if (angle === 270) {
        ctx.translate(0, width)
        ctx.rotate((270 * Math.PI) / 180)
      }

      ctx.putImageData(imageData, 0, 0)
      ctx.restore()
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

    // Keyboard shortcuts
    const setupKeyboardShortcuts = () => {
      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'z') {
            e.preventDefault()
            undo()
          }
          if (e.key === 'c') {
            e.preventDefault()
            copyToClipboard()
          }
          if (e.key === 's') {
            e.preventDefault()
            downloadImage()
          }
        }
        if (e.key === 'Escape') {
          currentTool.value = 'draw'
          pendingSticker.value = null
          pendingText.value = null
        }
      })
    }

    setupKeyboardShortcuts()

    return {
      canvas,
      imageLoaded,
      currentTool,
      pendingSticker,
      pendingText,
      stickerSize,
      toolStatus,
      brushColor,
      brushSize,
      zoomLevel,
      showGrid,
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

.text-options input[type="range"] {
  flex: 1;
  height: 4px;
  cursor: pointer;
}

.text-options span {
  color: #ffd93d;
  font-weight: bold;
  min-width: 40px;
  text-align: right;
}

.color-picker {
  width: 50px;
  height: 32px;
  border: 2px solid #ff6b6b;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-preview {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 2px solid #ffd93d;
  border-radius: 4px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.brush-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
}

.brush-preview svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .controls-section {
    grid-column: auto;
  }

  .controls-section:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .editor-header h1 {
    font-size: 1.8rem;
  }

  .editor-header p {
    font-size: 0.95rem;
  }

  .canvas-wrapper {
    min-height: 300px;
    padding: 10px;
  }

  .editor-sidebar {
    grid-template-columns: 1fr !important;
  }

  .controls-section {
    grid-column: auto !important;
  }

  .button-row {
    grid-template-columns: 1fr;
  }

  .tool-indicator {
    font-size: 0.75rem;
    padding: 6px 10px;
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .editor-header h1 {
    font-size: 1.4rem;
  }

  .canvas-wrapper {
    min-height: 250px;
  }

  .editor-canvas {
    max-height: 400px;
  }

  .controls-section {
    padding: 12px;
  }

  .text-options {
    gap: 8px;
  }
}
</style>
