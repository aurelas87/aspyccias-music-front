import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import HomeView from '@/views/pages/HomeView.vue'
import NewsMainView from '@/views/pages/News/NewsMainView.vue'
import NewsListView from '@/views/pages/News/NewsListView.vue'
import NewsDetailsView from '@/views/pages/News/NewsDetailsView.vue'
import MusicMainView from '@/views/pages/Music/MusicMainView.vue'
import MusicListView from '@/views/pages/Music/MusicListView.vue'
import MusicDetailsView from '@/views/pages/Music/MusicDetailsView.vue'
import ContactView from '@/views/pages/ContactView.vue'
import NotFoundView from '@/views/pages/NotFoundView.vue'
import AdminLoginView from '@/views/admin/AdminLoginView.vue'
import AdminProfileView from '@/views/admin/Profile/AdminProfileView.vue'
import AdminProfileLinksMainView from '@/views/admin/Profile/AdminProfileLinksMainView.vue'
import AdminProfileLinksListView from '@/views/admin/Profile/AdminProfileLinksListView.vue'
import AdminProfileLinksAddView from '@/views/admin/Profile/AdminProfileLinksAddView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'text-primary',
  routes: [
    {
      path: '/',
      name: 'home.menu',
      component: HomeView,
      meta: {
        menu: true
      }
    },
    {
      path: '/news',
      component: NewsMainView,
      children: [
        {
          path: '',
          name: 'news.menu',
          component: NewsListView,
          meta: {
            menu: true
          }
        },
        {
          path: ':slug',
          name: 'news.details',
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
          component: MusicListView,
          meta: {
            menu: true
          }
        },
        {
          path: ':slug',
          name: 'music.details',
          component: MusicDetailsView,
          props: true
        }
      ]
    },
    {
      path: '/contact',
      name: 'contact.menu',
      component: ContactView,
      meta: {
        menu: true
      }
    },
    {
      path: '/admin',
      children: [
        {
          path: 'login',
          name: 'admin.login',
          component: AdminLoginView
        },
        {
          path: 'profile',
          name: 'admin.profile',
          component: AdminProfileView,
          meta: {
            menu: true
          }
        },
        {
          path: 'links',
          component: AdminProfileLinksMainView,
          children: [
            {
              path: '',
              name: 'admin.links',
              component: AdminProfileLinksListView,
              meta: {
                menu: true
              }
            },
            {
              path: 'add',
              name: 'admin.links.add',
              component: AdminProfileLinksAddView
            }
          ]
        },
      ]
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()

  if (to.path.startsWith('/admin')) {
    await userStore.tryAndKeepUserConnectionAlive(to.path)

    if (!userStore.isConnected()) {
      if (!to.path.endsWith('login')) {
        return { name: 'admin.login' }
      } else {
        return true
      }
    } else if (to.path.endsWith('login')) {
      return { name: 'admin.profile' }
    }

    return true
  }
})

export default router
