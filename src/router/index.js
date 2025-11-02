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
      path: '/image-editor',
      name: 'image-editor',
      component: () => import('../views/ImageEditor.vue')
    },
  ]
})

export default router


