<script setup>
import { useSanityFetch } from '@/composables/useSanity'
import { urlFor, SITE_ID } from '@/lib/sanity'

// Fetch posts for this site, promoted first, then by date
const query = `*[_type == "post" && site == $site] | order(promoted desc, publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  promoted,
  mainImage { asset->, alt },
  "categories": categories[]->{ title, slug }
}`

const { data: posts, loading, error } = useSanityFetch(query, { site: SITE_ID })

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="blog">
    <div class="blog-hero">
      <h1 class="blog-title">BLOG</h1>
      <p class="blog-sub">thoughts, updates &amp; experiments</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="blog-loading">
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="blog-empty">
      <p>Failed to load posts. Check your Sanity configuration.</p>
      <code>{{ error.message }}</code>
    </div>

    <!-- Empty state -->
    <div v-else-if="!posts || posts.length === 0" class="blog-empty">
      <p>No posts yet. Create your first post in Sanity Studio.</p>
    </div>

    <!-- Posts -->
    <div v-else class="blog-grid">
      <router-link
        v-for="post in posts"
        :key="post._id"
        :to="'/blog/' + post.slug.current"
        class="post-card"
        :class="{ promoted: post.promoted }"
      >
        <!-- Image -->
        <div v-if="post.mainImage" class="post-image">
          <img
            :src="urlFor(post.mainImage).width(600).height(340).fit('crop').auto('format').url()"
            :alt="post.mainImage.alt || post.title"
            loading="lazy"
          />
          <span v-if="post.promoted" class="promoted-badge">Featured</span>
        </div>
        <div v-else class="post-image post-image--empty">
          <span v-if="post.promoted" class="promoted-badge">Featured</span>
        </div>

        <!-- Content -->
        <div class="post-content">
          <div class="post-meta">
            <time>{{ formatDate(post.publishedAt) }}</time>
            <span v-for="cat in (post.categories || [])" :key="cat.slug?.current" class="post-cat">
              {{ cat.title }}
            </span>
          </div>
          <h2 class="post-title">{{ post.title }}</h2>
          <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
          <span class="post-read">Read more &rarr;</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.blog {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

/* ─── Hero ─── */
.blog-hero {
  padding: 3rem 0 2rem;
  border-bottom: 2px solid var(--border);
  margin-bottom: 2rem;
}

.blog-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--accent);
}

.blog-sub {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.8rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 1rem;
  margin-bottom: 0;
}

/* ─── Loading ─── */
.blog-loading {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 4rem 0;
}

.loading-dot {
  width: 10px;
  height: 10px;
  background: var(--accent);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* ─── Empty ─── */
.blog-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-light);
}

.blog-empty code {
  display: block;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--accent);
}

/* ─── Post Grid ─── */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* ─── Post Card ─── */
.post-card {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 var(--border);
  text-decoration: none;
  color: var(--text);
  transition: transform 0.15s, box-shadow 0.15s;
  overflow: hidden;
  background: var(--accent-bg);
}

.post-card:hover {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 var(--border);
}

.post-card.promoted {
  border-color: var(--accent);
  box-shadow: 4px 4px 0 var(--accent);
}

.post-card.promoted:hover {
  box-shadow: 0 0 0 var(--accent);
}

/* ─── Post Image ─── */
.post-image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 2px solid var(--border);
  background: var(--accent-light);
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post-image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.promoted-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--accent);
  color: #fff;
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.6rem;
  border: 2px solid var(--border);
}

/* ─── Post Content ─── */
.post-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.post-meta time {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.7rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-cat {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--border);
  color: var(--text-light);
}

.post-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 0.5rem;
}

.post-excerpt {
  font-size: 0.85rem;
  color: var(--text-light);
  line-height: 1.5;
  margin: 0;
  flex: 1;
}

.post-read {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.75rem;
  color: var(--accent);
  margin-top: 1rem;
  font-weight: 700;
}

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .blog-hero {
    padding: 2rem 0 1.5rem;
  }

  .blog-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .post-card {
    box-shadow: 3px 3px 0 var(--border);
  }

  .post-card:hover {
    transform: translate(3px, 3px);
  }
}
</style>
