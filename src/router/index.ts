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
import AdminProfileLinksMainView from '@/views/admin/Profile/Links/AdminProfileLinksMainView.vue'
import AdminProfileLinksListView from '@/views/admin/Profile/Links/AdminProfileLinksListView.vue'
import AdminProfileLinksFormView from '@/views/admin/Profile/Links/AdminProfileLinksFormView.vue'
import AdminNewsMainView from '@/views/admin/News/AdminNewsMainView.vue'
import AdminNewsListView from '@/views/admin/News/AdminNewsListView.vue'
import AdminNewsFormView from '@/views/admin/News/AdminNewsFormView.vue'
import AdminCreditTypesMainView from '@/views/admin/Releases/CreditTypes/AdminCreditTypesMainView.vue'
import AdminCreditTypesListView from '@/views/admin/Releases/CreditTypes/AdminCreditTypesListView.vue'
import AdminCreditTypesFormView from '@/views/admin/Releases/CreditTypes/AdminCreditTypesFormView.vue'
import AdminReleasesMainView from '@/views/admin/Releases/AdminReleasesMainView.vue'
import AdminReleasesListView from '@/views/admin/Releases/AdminReleasesListView.vue'
import AdminReleasesFormView from '@/views/admin/Releases/AdminReleasesFormView.vue'
import AdminReleasesTracksFormView from '@/views/admin/Releases/AdminReleasesTracksFormView.vue'
import AdminReleasesLinksFormView from '@/views/admin/Releases/AdminReleasesLinksFormView.vue'
import AdminReleasesCreditsFormView from '@/views/admin/Releases/AdminReleasesCreditsFormView.vue'
import AdminReleaseLinkNamesMainView from '@/views/admin/Releases/LinkNames/AdminReleaseLinkNamesMainView.vue'
import AdminReleaseLinkNamesListView from '@/views/admin/Releases/LinkNames/AdminReleaseLinkNamesListView.vue'
import AdminReleaseLinkNamesFormView from '@/views/admin/Releases/LinkNames/AdminReleaseLinkNamesFormView.vue'

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
              component: AdminProfileLinksFormView
            },
            {
              path: 'edit/:name',
              name: 'admin.links.edit',
              component: AdminProfileLinksFormView,
              props: true
            }
          ]
        },
        {
          path: 'news',
          component: AdminNewsMainView,
          children: [
            {
              path: '',
              name: 'admin.news',
              component: AdminNewsListView,
              meta: {
                menu: true
              }
            },
            {
              path: 'add',
              name: 'admin.news.add',
              component: AdminNewsFormView
            },
            {
              path: 'edit/:slug',
              name: 'admin.news.edit',
              component: AdminNewsFormView,
              props: true
            }
          ]
        },
        {
          path: 'credit-types',
          component: AdminCreditTypesMainView,
          children: [
            {
              path: '',
              name: 'admin.credit-types',
              component: AdminCreditTypesListView,
              meta: {
                menu: true
              }
            },
            {
              path: 'add',
              name: 'admin.credit-types.add',
              component: AdminCreditTypesFormView
            },
            {
              path: 'edit/:credit_name_key',
              name: 'admin.credit-types.edit',
              component: AdminCreditTypesFormView,
              props: true
            }
          ]
        },
        {
          path: 'release-link-names',
          component: AdminReleaseLinkNamesMainView,
          children: [
            {
              path: '',
              name: 'admin.release-link-names',
              component: AdminReleaseLinkNamesListView,
              meta: {
                menu: true
              }
            },
            {
              path: 'add',
              name: 'admin.release-link-names.add',
              component: AdminReleaseLinkNamesFormView
            },
            {
              path: 'edit/:link_name',
              name: 'admin.release-link-names.edit',
              component: AdminReleaseLinkNamesFormView,
              props: true
            }
          ]
        },
        {
          path: 'releases',
          component: AdminReleasesMainView,
          children: [
            {
              path: '',
              name: 'admin.releases',
              component: AdminReleasesListView,
              meta: {
                menu: true
              }
            },
            {
              path: 'add',
              name: 'admin.releases.add',
              component: AdminReleasesFormView
            },
            {
              path: 'edit/:slug',
              name: 'admin.releases.edit',
              component: AdminReleasesFormView,
              props: true
            },
            {
              path: 'edit/:slug/tracks',
              name: 'admin.releases.edit.tracks',
              component: AdminReleasesTracksFormView,
              props: true
            },
            {
              path: 'edit/:slug/links',
              name: 'admin.releases.edit.links',
              component: AdminReleasesLinksFormView,
              props: true
            },
            {
              path: 'edit/:slug/credits',
              name: 'admin.releases.edit.credits',
              component: AdminReleasesCreditsFormView,
              props: true
            }
          ]
        },
        {
          path: ':pathMatch(.*)*',
          name: 'admin-not-found',
          redirect: { name: '404' }
        },
        {
          path: '404',
          name: '404',
          component: NotFoundView
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
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
    } else if (to.path.endsWith('login') || to.path.endsWith('/admin')) {
      return { name: 'admin.profile' }
    }

    return true
  }
})

export default router
