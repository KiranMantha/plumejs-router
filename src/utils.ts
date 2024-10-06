import { CurrentRoute, InternalRouteItem } from './router.model';

const paramRegex = /:([^/]+)/g;

export const getParams = (path: string) => {
  const params = [];
  let match: RegExpExecArray;
  while ((match = paramRegex.exec(path)) !== null) {
    params.push(match[0]);
  }
  return params;
};

const matchPath = (route: string, path: string): boolean => {
  if (route && path) {
    // const pattern = new RegExp(route.replace(/:[^\s/]+/g, '(.+)'));
    const pattern = new RegExp(`^${route.replace(/:[^\s/]+/g, '([^/]+)')}$`);
    return pattern.test(path);
  }
  return false;
};

function matchRoute(
  path: string,
  normalizedRoutes: InternalRouteItem[]
): { route: InternalRouteItem; routeData: Partial<CurrentRoute> } | null {
  const searchPath = path.split('?')[0];
  const urlSegments = searchPath.split('/').filter(Boolean);

  for (const route of normalizedRoutes) {
    const routeFragments = route.fragments;
    // If the route has fewer fragments than the URL segments and no wildcard, skip this route.
    if (routeFragments.length >= urlSegments.length || routeFragments.includes('*')) {
      const routeParams: Record<string, string | number | boolean> = {};
      let isMatch = true;

      for (let i = 0; i < routeFragments.length; i++) {
        const routeSegment = routeFragments[i];
        const urlSegment = urlSegments[i];

        if (routeSegment === '*') {
          // Wildcard match, stop further comparison, everything else matches
          isMatch = true;
          break;
        }

        if (!urlSegment && routeSegment !== '*') {
          // URL has fewer segments than the route fragments and no wildcard present
          isMatch = false;
          break;
        }

        if (routeSegment.startsWith(':')) {
          // Extract route params
          routeParams[routeSegment.substring(1)] = urlSegment;
        } else if (routeSegment !== urlSegment) {
          // Segment mismatch
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        // Extract query params
        const queryParams: Record<string, string | number | boolean> = Object.fromEntries(
          new URLSearchParams(window.location.search).entries()
        );
        return { route, routeData: { path, routeParams, queryParams } };
      }
    }
  }

  return null;
}

const PAGE_NOT_FOUND_TEMPLATE = `
  <div style='text-align: center'>
    <h1>404</h1>
    <h3>not Found</h3>
  </div>
`;

export { matchPath, matchRoute, PAGE_NOT_FOUND_TEMPLATE };
