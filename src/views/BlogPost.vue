<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PortableText } from '@portabletext/vue'
import { h } from 'vue'
import { useSanityFetch } from '@/composables/useSanity'
import { urlFor } from '@/lib/sanity'

const route = useRoute()
const router = useRouter()

const slug = computed(() => route.params.slug)

const query = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  publishedAt,
  mainImage { asset->, alt },
  body,
  promoted,
  excerpt,
  "categories": categories[]->{ title, slug }
}`

const { data: post, loading, error } = useSanityFetch(query, computed(() => ({
  slug: slug.value,
})))

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Portable Text custom component renderers
const ptComponents = {
  types: {
    image: ({ value }) =>
      h('figure', { class: 'pt-figure' }, [
        h('img', {
          src: urlFor(value).width(900).auto('format').url(),
          alt: value.alt || '',
          loading: 'lazy',
          class: 'pt-image',
        }),
        value.caption
          ? h('figcaption', { class: 'pt-caption' }, value.caption)
          : null,
      ]),
  },
  marks: {
    link: ({ value }, { slots }) =>
      h(
        'a',
        { href: value.href, target: '_blank', rel: 'noopener noreferrer', class: 'pt-link' },
        slots.default?.(),
      ),
  },
}
</script>

<template>
  <div class="blog-post">
    <!-- Loading -->
    <div v-if="loading" class="post-loading">Loading...</div>

    <!-- Error / Not found -->
    <div v-else-if="error || !post" class="post-empty">
      <p>{{ error ? 'Failed to load post.' : 'Post not found.' }}</p>
      <button @click="router.push('/blog')">&larr; Back to blog</button>
    </div>

    <!-- Article -->
    <article v-else>
      <!-- Back link -->
      <router-link to="/blog" class="back-link">&larr; All posts</router-link>

      <!-- Header -->
      <header class="post-header">
        <div class="post-meta">
          <time>{{ formatDate(post.publishedAt) }}</time>
          <span v-for="cat in (post.categories || [])" :key="cat.slug?.current" class="post-cat">
            {{ cat.title }}
          </span>
          <span v-if="post.promoted" class="promoted-tag">Featured</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
      </header>

      <!-- Hero image -->
      <div v-if="post.mainImage" class="post-hero-image">
        <img
          :src="urlFor(post.mainImage).width(900).height(480).fit('crop').auto('format').url()"
          :alt="post.mainImage.alt || post.title"
        />
      </div>

      <!-- Body -->
      <div class="post-body">
        <PortableText :value="post.body" :components="ptComponents" />
      </div>

      <!-- Footer -->
      <footer class="post-footer">
        <router-link to="/blog" class="back-link">&larr; All posts</router-link>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.blog-post {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

/* ─── Back Link ─── */
.back-link {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.8rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 1.5rem;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.7;
}

/* ─── Loading / Empty ─── */
.post-loading,
.post-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-light);
}

.post-empty button {
  margin-top: 1rem;
}

/* ─── Header ─── */
.post-header {
  padding: 1rem 0 1.5rem;
  border-bottom: 2px solid var(--border);
  margin-bottom: 2rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.post-meta time {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.75rem;
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

.promoted-tag {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.5rem;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
}

.post-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.post-excerpt {
  font-size: 1.05rem;
  color: var(--text-light);
  line-height: 1.6;
  margin: 1rem 0 0;
}

/* ─── Hero Image ─── */
.post-hero-image {
  margin-bottom: 2rem;
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 var(--border);
  overflow: hidden;
}

.post-hero-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* ─── Body (Portable Text) ─── */
.post-body {
  font-size: 1.05rem;
  line-height: 1.7;
}

.post-body :deep(p) {
  margin: 0 0 1.25rem;
}

.post-body :deep(h2) {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 2.5rem 0 0.75rem;
  letter-spacing: -0.01em;
}

.post-body :deep(h3) {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: 1.2rem;
  font-weight: 700;
  margin: 2rem 0 0.5rem;
}

.post-body :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--text-light);
}

.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.post-body :deep(li) {
  margin-bottom: 0.4rem;
}

.post-body :deep(.pt-figure) {
  margin: 2rem 0;
  border: 2px solid var(--border);
  box-shadow: 4px 4px 0 var(--border);
  overflow: hidden;
}

.post-body :deep(.pt-image) {
  width: 100%;
  height: auto;
  display: block;
}

.post-body :deep(.pt-caption) {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.75rem;
  color: var(--text-light);
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--border);
}

.post-body :deep(.pt-link) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.post-body :deep(.pt-link:hover) {
  text-decoration: none;
}

/* ─── Footer ─── */
.post-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--border);
}

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .post-hero-image {
    box-shadow: 3px 3px 0 var(--border);
  }

  .post-body :deep(.pt-figure) {
    box-shadow: 3px 3px 0 var(--border);
  }
}
</style>
