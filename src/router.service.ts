//https://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
import { Injectable } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';
import { registerRouterOutlet } from './router.component';
import { Route } from './router.model';
import { StaticRouter } from './staticRouter';

function normalizeRoute(route: Route, parentPath = '') {
  // // Ensure the path starts with a slash
  const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/');
  StaticRouter.formatRoute({ ...route, path: fullPath });

  (route.children || []).forEach((childRoute) => {
    normalizeRoute(childRoute, fullPath);
  });
}

@Injectable({ deps: [InternalRouter] })
export class Router {
  constructor(private internalRouter: InternalRouter) {
    registerRouterOutlet();
  }

  getCurrentRoute() {
    return this.internalRouter.getCurrentRoute();
  }

  navigateTo(path: string, state?: Record<string, unknown>) {
    this.internalRouter.navigateTo(path, state);
  }

  onNavigationEnd() {
    return this.internalRouter.onNavigationEnd();
  }

  static registerRoutes({ routes, preloadAllRoutes = false }: { routes: Array<Route>; preloadAllRoutes?: boolean }) {
    if (Array.isArray(routes)) {
      for (const route of routes) {
        normalizeRoute(route);
      }
      if (preloadAllRoutes) {
        StaticRouter.preloadRoutes();
      } else {
        StaticRouter.preloadSelectedRoutes();
      }
    } else {
      throw Error('router.addRoutes: the parameter must be an array');
    }
  }
}
