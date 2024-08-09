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
      path: '/analyzer',
      name: 'analyzer',
      component: () => import('../views/Analyzer.vue')
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
      path: '/movie',
      name: 'movie',
      component: () => import('../views/Omdb.vue')
    },


  ]
})

export default router
