<template>
  <div class="export-panel">
    <h3>📤 Export & Share</h3>

    <div class="export-group">
      <h4>Download Options</h4>
      <div class="button-group">
        <button
          class="export-btn download"
          @click="$emit('download')"
        >
          ⬇️ PNG
        </button>
        <button
          class="export-btn download"
          @click="downloadJPEG"
        >
          ⬇️ JPEG
        </button>
      </div>
    </div>

    <div class="export-group">
      <h4>Quick Share</h4>
      <button
        class="export-btn copy"
        @click="$emit('copy-clipboard')"
      >
        📋 Copy to Clipboard
      </button>
    </div>

    <div class="export-group">
      <h4>Share to Social</h4>
      <div class="social-buttons">
        <button
          class="social-btn instagram"
          @click="shareToSocial('instagram')"
          title="Share on Instagram"
        >
          📱 Instagram
        </button>
        <button
          class="social-btn twitter"
          @click="shareToSocial('twitter')"
          title="Share on Twitter/X"
        >
          𝕏 Twitter
        </button>
        <button
          class="social-btn tiktok"
          @click="shareToSocial('tiktok')"
          title="Share on TikTok"
        >
          🎵 TikTok
        </button>
      </div>
    </div>

    <div class="export-group">
      <h4>Share Link</h4>
      <button
        class="export-btn share"
        @click="$emit('generate-share')"
      >
        🔗 Generate Share Link
      </button>
      <p class="share-info">
        Creates a unique shareable URL for your meme
      </p>
    </div>

    <div class="export-info">
      <p>💡 <strong>Tip:</strong> Download your masterpiece or share it with friends!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportPanel',
  emits: ['download', 'copy-clipboard', 'generate-share', 'show-notification'],
  setup(props, { emit }) {
    const downloadJPEG = () => {
      emit('download')
    }

    const shareToSocial = (platform) => {
      // Create share URL
      const baseUrl = window.location.hostname === 'localhost'
        ? 'https://playground.dizid.com'
        : window.location.origin

      const shareId = `share-${Date.now()}`
      const shareUrl = `${baseUrl}/image-editor?share=${shareId}`

      // Social media share URLs
      const socialUrls = {
        instagram: `https://www.instagram.com/`,
        twitter: `https://twitter.com/intent/tweet?text=Check%20out%20my%20funny%20meme!&url=${encodeURIComponent(shareUrl)}`,
        tiktok: `https://www.tiktok.com/`
      }

      // First, generate the share link
      emit('generate-share')

      // Copy URL to clipboard and provide feedback
      navigator.clipboard.writeText(shareUrl).then(() => {
        // Show in-app notification that link was copied
        emit('show-notification', {
          type: 'success',
          message: `✅ Link copied to clipboard! Opening ${platform}...`
        })

        // Delay opening the platform slightly to ensure notification is visible
        setTimeout(() => {
          if (platform === 'twitter') {
            window.open(socialUrls.twitter, '_blank')
          } else if (platform === 'instagram') {
            window.open('https://www.instagram.com/', '_blank')
          } else if (platform === 'tiktok') {
            window.open('https://www.tiktok.com/', '_blank')
          }
        }, 500)
      }).catch(() => {
        // Show error notification
        emit('show-notification', {
          type: 'error',
          message: '❌ Failed to copy link to clipboard. Opening platform anyway...'
        })

        // Delay opening the platform slightly
        setTimeout(() => {
          window.open(socialUrls[platform] || 'https://www.instagram.com/', '_blank')
        }, 500)
      })
    }

    return {
      downloadJPEG,
      shareToSocial
    }
  }
}
</script>

<style scoped>
.export-panel {
  background: #16213e;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #0f3460;
}

.export-panel h3 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #ffd93d;
  text-align: center;
}

.export-group {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #0f3460;
}

.export-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.export-group h4 {
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

.export-btn {
  padding: 10px 12px;
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  color: #eee;
  border: 2px solid #ffd93d;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
}

.export-btn:hover {
  background: linear-gradient(135deg, #ffd93d 0%, #ff8c42 100%);
  color: #1a1a2e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 217, 61, 0.3);
}

.export-btn.download {
  border-color: #4ecdc4;
}

.export-btn.download:hover {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border-color: #44a08d;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.export-btn.copy {
  border-color: #95e1d3;
}

.export-btn.copy:hover {
  background: linear-gradient(135deg, #95e1d3 0%, #4ecdc4 100%);
  border-color: #4ecdc4;
  box-shadow: 0 4px 12px rgba(149, 225, 211, 0.3);
}

.export-btn.share {
  border-color: #f38181;
}

.export-btn.share:hover {
  background: linear-gradient(135deg, #f38181 0%, #ff6b6b 100%);
  border-color: #ff6b6b;
  box-shadow: 0 4px 12px rgba(243, 129, 129, 0.3);
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.social-btn {
  padding: 9px 12px;
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  color: #eee;
  border: 2px solid #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
}

.social-btn:hover {
  transform: translateX(4px);
}

.social-btn.instagram {
  border-color: #e1306c;
  color: #e1306c;
}

.social-btn.instagram:hover {
  background: linear-gradient(135deg, #e1306c 0%, #fd1d1d 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(225, 48, 108, 0.3);
}

.social-btn.twitter {
  border-color: #1da1f2;
  color: #1da1f2;
}

.social-btn.twitter:hover {
  background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(29, 161, 242, 0.3);
}

.social-btn.tiktok {
  border-color: #25f4ee;
  color: #25f4ee;
}

.social-btn.tiktok:hover {
  background: linear-gradient(135deg, #25f4ee 0%, #fe2c55 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 244, 238, 0.3);
}

.share-info {
  margin: 8px 0 0 0;
  font-size: 0.75rem;
  color: #888;
  font-style: italic;
}

.export-info {
  background: rgba(255, 217, 61, 0.1);
  border-left: 3px solid #ffd93d;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.export-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #ccc;
}

.export-info strong {
  color: #ffd93d;
}
</style>
