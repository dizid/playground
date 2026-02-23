import { ref, onMounted, watch, isRef } from 'vue'
import { client } from '@/lib/sanity'

/**
 * Reactive Sanity GROQ fetch composable.
 * @param {string} query - GROQ query string
 * @param {object|Ref} params - Query parameters (can be a ref for reactivity)
 */
export function useSanityFetch(query, params = {}) {
  const data = ref(null)
  const loading = ref(true)
  const error = ref(null)

  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const resolvedParams = isRef(params) ? params.value : params
      data.value = await client.fetch(query, resolvedParams)
    } catch (err) {
      error.value = err
      console.error('Sanity fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)

  // Re-fetch if params change (useful for slug-based routes)
  if (isRef(params)) {
    watch(params, fetchData)
  }

  return { data, loading, error, refetch: fetchData }
}
