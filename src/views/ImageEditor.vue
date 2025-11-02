<template>
  <div class="image-editor-container">
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>

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

        <div class="random-button-section">
          <button class="random-btn" @click="handleRandomEffect" title="Apply random effect!">
            🎲 Random!
          </button>
        </div>

        <ExportPanel
          @download="downloadImage"
          @copy-clipboard="copyToClipboard"
          @generate-share="generateShareLink"
          @show-notification="showNotification"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, computed, onMounted } from 'vue'
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
    const funnyEffects = ref(null)
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
    const canvasScale = ref(1)
    const notification = ref({
      show: false,
      type: 'success',
      message: ''
    })

    const showNotification = (data) => {
      notification.value = {
        show: true,
        type: data.type || 'success',
        message: data.message
      }

      // Auto-hide after 4 seconds
      setTimeout(() => {
        notification.value.show = false
      }, 4000)
    }

    const saveToHistory = () => {
      if (!canvas.value) return
      const ctx = canvas.value.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)

      // Remove any future history if we're not at the end
      history.value = history.value.slice(0, historyIndex.value + 1)

      history.value.push(imageData)

      // Limit history to 11 total (initial + 10 undoable steps)
      if (history.value.length > 11) {
        history.value.shift()
        historyIndex.value = 10
      } else {
        historyIndex.value = history.value.length - 1
      }
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

              // Set canvas resolution (internal) to match image size
              // Don't apply DPI scaling to avoid coordinate calculation issues
              canvas.value.width = img.width
              canvas.value.height = img.height

              // Canvas display size is automatically 1:1 with internal resolution when not constrained by CSS
              ctx.drawImage(img, 0, 0)
              // Store original image data using canvas dimensions
              originalImageData.value = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
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

      // Calculate position in CSS pixel space
      const cssX = e.clientX - rect.left
      const cssY = e.clientY - rect.top

      // Scale to internal canvas resolution
      const scaleX = canvas.value.width / rect.width
      const scaleY = canvas.value.height / rect.height

      const x = cssX * scaleX
      const y = cssY * scaleY

      const fontWeight = pendingText.value.bold ? 'bold' : 'normal'
      let fontFamily = pendingText.value.font || 'Arial, sans-serif'

      // Normalize font names - ensure font families with spaces are properly quoted
      // Split by comma to get primary font and fallbacks
      const fontParts = fontFamily.split(',').map(f => {
        const trimmed = f.trim()
        // If the font name has spaces and isn't already quoted, add quotes
        if (trimmed.includes(' ') && !trimmed.startsWith("'") && !trimmed.startsWith('"')) {
          return `'${trimmed}'`
        }
        return trimmed
      })
      fontFamily = fontParts.join(', ')

      ctx.font = `${fontWeight} ${pendingText.value.fontSize}px ${fontFamily}`
      ctx.fillStyle = pendingText.value.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Only draw outline if explicitly enabled
      if (pendingText.value.outline) {
        ctx.strokeStyle = pendingText.value.outlineColor
        ctx.lineWidth = 4
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

      // Calculate position in CSS pixel space
      const cssX = e.clientX - rect.left
      const cssY = e.clientY - rect.top

      // Scale to internal canvas resolution
      const scaleX = canvas.value.width / rect.width
      const scaleY = canvas.value.height / rect.height

      const x = cssX * scaleX
      const y = cssY * scaleY

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

      // The key issue: canvas has internal resolution (width/height attributes)
      // vs CSS display size (style.width/style.height or from CSS rules)
      // We need to scale coordinates from CSS space to internal resolution space

      // Calculate position in CSS pixel space
      const cssX = e.clientX - rect.left
      const cssY = e.clientY - rect.top

      // Scale to internal canvas resolution
      // rect.width/height are CSS pixels, canvas.width/height are internal pixels
      const scaleX = canvas.value.width / rect.width
      const scaleY = canvas.value.height / rect.height

      const x = cssX * scaleX
      const y = cssY * scaleY

      ctx.fillStyle = brushColor.value
      const radius = brushSize.value / 2
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const stopDrawing = () => {
      if (isDrawing.value) {
        isDrawing.value = false
        // Save drawing to history when user stops
        saveToHistory()
      }
    }


    const applyEffect = (effectInput) => {
      if (!imageLoaded.value || !canvas.value) return
      const ctx = canvas.value.getContext('2d')

      // Handle both string and object inputs
      const effectType = typeof effectInput === 'string' ? effectInput : effectInput.type
      const effectValue = typeof effectInput === 'object' ? effectInput.value : null

      // For slider effects, always work from original image to avoid cumulative effects
      // NOTE: preset is NOT included here because it should apply on top of existing edits
      const isSliderEffect = ['brightness', 'contrast', 'saturation'].includes(effectType)

      let imageData
      if (isSliderEffect) {
        // Use original image data as base
        imageData = new ImageData(
          new Uint8ClampedArray(originalImageData.value.data),
          originalImageData.value.width,
          originalImageData.value.height
        )
      } else {
        // For non-slider effects and presets, get current canvas state
        imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
      }

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
        case 'preset':
          // Apply preset - brightness, contrast, saturation in order
          applyBrightnessEffect(data, effectValue.brightness)
          applyContrastEffect(data, effectValue.contrast)
          applySaturationEffect(data, effectValue.saturation)
          break
      }

      if (effectType !== 'flip-h' && effectType !== 'flip-v') {
        ctx.putImageData(imageData, 0, 0)
      }

      // Save non-slider effects to history (includes presets now)
      // Slider effects (brightness, contrast, saturation) are not saved to avoid cluttering
      if (!isSliderEffect) {
        saveToHistory()
      }
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
      const width = imageData.width
      const height = imageData.height
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
      const width = imageData.width
      const height = imageData.height
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
              // Silent success - image is copied
              console.log('Image copied to clipboard')
            }).catch((err) => {
              console.error('Clipboard write error:', err)
            })
          }
        }, 'image/png')
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
      }
    }

    const generateShareLink = () => {
      // Simplified approach: just copy the base editor URL
      // Users will download the image and manually share it
      const baseUrl = window.location.hostname === 'localhost'
        ? 'https://playground.dizid.com'
        : window.location.origin

      const shareUrl = `${baseUrl}/image-editor`

      navigator.clipboard.writeText(shareUrl).then(() => {
        console.log('Editor URL copied to clipboard')
      }).catch(() => {
        console.log('Editor URL:', shareUrl)
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

    // Call setup function when canvas is mounted
    onMounted(() => {
      setupTouchListeners()
    })

    // Setup touch listeners with {passive: false} to allow preventDefault()
    const setupTouchListeners = () => {
      if (!canvas.value) return

      const canvasElement = canvas.value

      // Remove passive default by explicitly setting passive: false
      canvasElement.addEventListener('touchstart', (e) => {
        if (currentTool.value === 'draw') {
          e.preventDefault()
          isDrawing.value = true
        } else if (currentTool.value === 'text' || currentTool.value === 'sticker') {
          e.preventDefault()
          // Don't set isDrawing for text/sticker tools
        }
      }, { passive: false })

      canvasElement.addEventListener('touchmove', (e) => {
        if (!isDrawing.value || currentTool.value !== 'draw') return
        e.preventDefault()

        const touch = e.touches[0]
        const ctx = canvas.value.getContext('2d')
        const rect = canvas.value.getBoundingClientRect()

        // Calculate position in CSS pixel space
        const cssX = touch.clientX - rect.left
        const cssY = touch.clientY - rect.top

        // Scale to internal canvas resolution
        const scaleX = canvas.value.width / rect.width
        const scaleY = canvas.value.height / rect.height

        const x = cssX * scaleX
        const y = cssY * scaleY

        // Draw if within canvas bounds (with small tolerance for floating point)
        // Allow drawing anywhere on the visible canvas
        if (cssX >= 0 && cssX <= rect.width && cssY >= 0 && cssY <= rect.height) {
          ctx.fillStyle = brushColor.value
          const radius = brushSize.value / 2
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }, { passive: false })

      canvasElement.addEventListener('touchend', (e) => {
        if (currentTool.value === 'draw') {
          e.preventDefault()
          if (isDrawing.value) {
            isDrawing.value = false
            saveToHistory()
          }
        } else if (currentTool.value === 'text' || currentTool.value === 'sticker') {
          e.preventDefault()
          // For text/sticker placement, we need to use the last touch position
          // Get the touch that just ended
          const touch = e.changedTouches[0]
          if (touch) {
            // Create a synthetic event object with clientX/clientY for text/sticker placement
            const fakeEvent = {
              clientX: touch.clientX,
              clientY: touch.clientY
            }

            if (currentTool.value === 'text') {
              addTextAtPosition(fakeEvent)
              currentTool.value = 'draw'
            } else if (currentTool.value === 'sticker') {
              if (pendingSticker.value) {
                addStickerAtPosition(fakeEvent)
                pendingSticker.value = null
              }
              currentTool.value = 'draw'
            }
          }
        }
      }, { passive: false })
    }

    const handleRandomEffect = () => {
      // Call the randomEffect method from FunnyEffects component
      if (funnyEffects.value) {
        funnyEffects.value.randomEffect()
      }
    }

    return {
      canvas,
      funnyEffects,
      imageLoaded,
      currentTool,
      pendingSticker,
      pendingText,
      stickerSize,
      toolStatus,
      brushColor,
      brushSize,
      notification,
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
      showNotification,
      undo,
      handleRandomEffect
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

.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: bold;
  z-index: 9999;
  animation: slideDown 0.3s ease-out;
}

.notification.success {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
}

.notification.error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8c42 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.notification.info {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.notification.warning {
  background: linear-gradient(135deg, #ffd93d 0%, #ffa500 100%);
  color: #1a1a2e;
  box-shadow: 0 4px 12px rgba(255, 217, 61, 0.4);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
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
  position: relative;
  touch-action: none;
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
  touch-action: none;
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

.random-button-section {
  background: #16213e;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #0f3460;
  display: flex;
  justify-content: center;
}

.random-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%);
  color: #1a1a2e;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 900;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 200px;
}

.random-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 217, 61, 0.5);
}

.random-btn:active {
  transform: scale(0.95);
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
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 900px) {
  .editor-canvas {
    max-height: 400px;
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

  .editor-main {
    gap: 10px;
  }

  .canvas-wrapper {
    min-height: 280px;
    padding: 8px;
  }

  .editor-canvas {
    max-height: 350px;
  }

  .controls-section {
    padding: 10px;
  }

  .text-options {
    gap: 6px;
    font-size: 0.75rem;
  }

  .editor-sidebar {
    gap: 10px;
    display: flex;
    flex-direction: column;
  }

  .random-button-section {
    padding: 10px;
  }

  .random-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>
