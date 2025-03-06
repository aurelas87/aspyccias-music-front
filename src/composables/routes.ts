import type { RouteLocationNormalizedLoaded, RouteRecord } from 'vue-router'
import { useRouter } from 'vue-router'

export function useRoutes() {
  const router = useRouter()
  const routes = router.getRoutes()

  function getPublicRoutes() {
    return routes.filter(function (route: RouteRecord) {
      return !isAdminRoute(route) && route.meta.menu
    })
  }

  function getAdminRoutes() {
    return routes.filter(function (route: RouteRecord) {
      return isAdminRoute(route) && route.meta.menu
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
