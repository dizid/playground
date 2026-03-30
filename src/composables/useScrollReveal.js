import { onMounted, onUnmounted } from 'vue'

/**
 * Lightweight scroll-reveal using IntersectionObserver.
 * Elements with [data-reveal] get [data-revealed="true"] when visible.
 * CSS handles the actual animations.
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    once = true,
  } = options

  let observer = null
  const elements = new Set()

  function observe(el) {
    if (!el) return
    elements.add(el)
    if (observer) observer.observe(el)
  }

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true')
          if (once) {
            observer.unobserve(entry.target)
            elements.delete(entry.target)
          }
        } else if (!once) {
          entry.target.removeAttribute('data-revealed')
        }
      })
    }, { threshold, rootMargin })

    // Observe any elements registered before mount
    elements.forEach((el) => observer.observe(el))
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    elements.clear()
  })

  return { observe }
}
