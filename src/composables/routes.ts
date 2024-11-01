import type { RouteLocationNormalizedLoaded, RouteRecord, RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'

export function useRoutes() {
  const router = useRouter()
  const routes = router.getRoutes()

  function getPublicRoutes() {
    return routes.filter(function (route: RouteRecord) {
      return !isAdminRoute(route)
    })
  }

  function getAdminRoutes() {
    return routes.filter(function (route: RouteRecord) {
      return isAdminRoute(route) && !route.name?.toString().endsWith('login')
    })
  }

  function getRoutes() {
    if (isCurrentAdminRoute()) {
      return getAdminRoutes()
    } else {
      return getPublicRoutes()
    }
  }

  function isAdminRoute(route: RouteLocationNormalizedLoaded | RouteRecord) {
    return route.path.startsWith('/admin')
  }

  function isCurrentAdminRoute() {
    return isAdminRoute(router.currentRoute.value)
  }

  return { getRoutes, isCurrentAdminRoute }
}
