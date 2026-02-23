import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client — reads from the CDN for fast public queries
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
})

// Image URL builder — chain .width(), .height(), .fit(), .auto('format'), .url()
const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

// Site filter — each site passes its own ID via env var
export const SITE_ID = import.meta.env.VITE_SANITY_SITE_ID || 'playground'
