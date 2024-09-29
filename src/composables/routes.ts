import { type RouteRecord, useRouter } from 'vue-router'

export function useRoutes() {
  const router = useRouter()
  const routes = useRouter().getRoutes()

  function getPublicRoutes() {
    return routes.filter(function (route: RouteRecord) {
      return !route.name?.toString().startsWith('admin')
    })
  }

  function getAdminRoutes() {
    return routes.filter(function (route: RouteRecord) {
      return route.name?.toString().startsWith('admin') && !route.name?.toString().endsWith('login')
    })
  }

  function getRoutes() {
    if (isAdminRoute()) {
      return getAdminRoutes()
    } else {
      return getPublicRoutes()
    }
  }

  function isAdminRoute() {
    return router.currentRoute.value.path.startsWith('/admin')
  }

  return { getRoutes, isAdminRoute }
}
