<template>
  <div v-if="visible" class="toast" :class="[type, position]">
    <span class="toast-message">{{ message }}</span>
    <button v-if="dismissible" class="toast-close" @click="close">✕</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    },
    position: {
      type: String,
      default: 'bottom-right',
      validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const visible = ref(true)

    const close = () => {
      visible.value = false
      emit('close')
    }

    if (props.duration > 0) {
      setTimeout(() => {
        close()
      }, props.duration)
    }

    return {
      visible,
      close
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  padding: 12px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast.success {
  background: #10b981;
  color: white;
  border: 2px solid #059669;
}

.toast.error {
  background: #ef4444;
  color: white;
  border: 2px solid #dc2626;
}

.toast.info {
  background: #3b82f6;
  color: white;
  border: 2px solid #1d4ed8;
}

.toast.warning {
  background: #f59e0b;
  color: white;
  border: 2px solid #d97706;
}

.toast.top-right {
  top: 20px;
  right: 20px;
}

.toast.top-left {
  top: 20px;
  left: 20px;
}

.toast.bottom-right {
  bottom: 20px;
  right: 20px;
}

.toast.bottom-left {
  bottom: 20px;
  left: 20px;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}
</style>
