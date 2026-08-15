import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/age',
      name: 'age',
      component: () => import('../views/Age.vue')
    },
    {
      path: '/love',
      name: 'love',
      component: () => import('../views/Love.vue')
    },
    {
      path: '/advice',
      name: 'advice',
      component: () => import('../views/Advice.vue')
    },
    {
      path: '/grumpy-ai',
      name: 'grumpy-ai',
      component: () => import('../views/ChatGPT.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogList.vue')
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPost.vue'),
      props: true
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('../views/ShowcaseView.vue')
    },
    {
      path: '/story',
      name: 'story',
      component: () => import('../views/StoryView.vue')
    },
  ]
})

export default router


