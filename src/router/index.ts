import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/pages/HomeView.vue'
import NewsView from '@/views/pages/NewsView.vue'
import MusicView from '@/views/pages/MusicView.vue'
import ContactView from '@/views/pages/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView
    },
    {
      path: '/music',
      name: 'music',
      component: MusicView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
  ]
})

export default router
