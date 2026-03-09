import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface RouterState {
  route: null | RouteLocationNormalizedLoaded
  routesList: RouteLocationNormalizedLoaded[]
}