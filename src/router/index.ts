import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/pages/HomeView.vue'
import NewsMainView from '@/views/pages/News/NewsMainView.vue'
import NewsListView from '@/views/pages/News/NewsListView.vue'
import NewsDetailsView from '@/views/pages/News/NewsDetailsView.vue'
import MusicView from '@/views/pages/MusicView.vue'
import ContactView from '@/views/pages/ContactView.vue'
import NotFoundView from '@/views/pages/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'text-primary',
  routes: [
    {
      path: '/',
      name: 'home.menu',
      component: HomeView
    },
    {
      path: '/news',
      component: NewsMainView,
      children: [
        {
          path: '',
          name: 'news.menu',
          component: NewsListView
        },
        {
          path: ':slug',
          component: NewsDetailsView,
          props: true
        }
      ]
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
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

export default router
