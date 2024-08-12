import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/pages/HomeView.vue'
import NewsMainView from '@/views/pages/News/NewsMainView.vue'
import NewsListView from '@/views/pages/News/NewsListView.vue'
import NewsDetailsView from '@/views/pages/News/NewsDetailsView.vue'
import MusicMainView from '@/views/pages/Music/MusicMainView.vue'
import MusicListView from '@/views/pages/Music/MusicListView.vue'
import MusicDetailsView from '@/views/pages/Music/MusicDetailsView.vue'
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
      component: MusicMainView,
      children: [
        {
          path: '',
          name: 'music.menu',
          component: MusicListView
        },
        {
          path: ':slug',
          component: MusicDetailsView,
          props: true
        }
      ]
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
