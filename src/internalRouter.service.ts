import { BehaviourSubjectObs, Injectable, SubjectObs, fromEvent, wrapIntoObservable } from '@plumejs/core';
import { ICurrentRoute, InternalRouteItem } from './router.model';
import { StaticRouter } from './staticRouter';
import { matchPath } from './utils';

@Injectable()
export class InternalRouter {
  private _currentRoute = new BehaviourSubjectObs<ICurrentRoute>({
    path: '',
    routeParams: new Map(),
    queryParams: new Map(),
    state: {}
  });
  private _template = new BehaviourSubjectObs('');
  private _navigationEndEvent = new SubjectObs();
  private _routeStateMap = new Map<string, Record<string, unknown>>();

  listenRouteChanges() {
    const event = 'popstate';
    window.history.replaceState({}, null, '');
    (function (history: History, fn: () => void) {
      const pushState = history.pushState;
      history.pushState = function (...args) {
        pushState.apply(history, args);
        fn();
      };
    })(window.history, this._registerOnHashChange.bind(this));
    return fromEvent(window, event, () => {
      this._registerOnHashChange();
    });
  }

  getTemplate(): { subscribe: (fn: (value?: string) => void) => () => void } {
    return this._template.asObservable();
  }

  getCurrentRoute(): { subscribe: (fn: (value?: ICurrentRoute) => void) => () => void } {
    return this._currentRoute.asObservable();
  }

  navigateTo(path = '/', state: Record<string, unknown>) {
    let windowPath = window.location.pathname;
    windowPath = windowPath || '/';
    this._routeStateMap.clear();
    this._routeStateMap.set(path, state);
    if (windowPath === path) {
      this._navigateTo(path, state);
    } else {
      window.history.pushState(state, '', path);
    }
  }

  onNavigationEnd() {
    return this._navigationEndEvent.asObservable();
  }

  private _registerOnHashChange() {
    const path = window.location.pathname;
    const state = this._routeStateMap.get(path);
    this._navigateTo(path, state);
  }

  private _navigateTo(path: string, state: Record<string, unknown>) {
    const currentRouteData: Partial<ICurrentRoute> = {};
    const uParams = path.split('/').filter((h) => {
      return h.length > 0;
    });
    const routeArr = StaticRouter.routeList.filter((route) => {
      if (route.params.length === uParams.length && matchPath(route.url, path)) {
        return route;
      } else if (route.url === path) {
        return route;
      }
    });
    const routeItem = routeArr.length > 0 ? routeArr[0] : null;
    if (routeItem) {
      currentRouteData.path = path;
      currentRouteData.state = { ...(state || {}) };
      wrapIntoObservable(routeItem.canActivate()).subscribe((val: boolean) => {
        if (!val) return;
        const _params = StaticRouter.checkParams(routeItem.url, path, routeItem.params);
        if (Object.keys(_params).length > 0 || path) {
          currentRouteData.routeParams = new Map(Object.entries(_params));
          const entries: Iterable<[string, string]> = new URLSearchParams(window.location.search).entries();
          currentRouteData.queryParams = new Map(entries);
          const triggerNavigation = (routeItem: InternalRouteItem) => {
            routeItem.isRegistered = true;
            this._currentRoute.next(currentRouteData as ICurrentRoute);
            this._template.next(routeItem.template);
            this._navigationEndEvent.next(null);
          };
          if (!routeItem.isRegistered) {
            if (routeItem.templatePath) {
              wrapIntoObservable(routeItem.templatePath()).subscribe(() => {
                triggerNavigation(routeItem);
              });
            } else if (routeItem.redirectTo) {
              this.navigateTo(routeItem.redirectTo, state);
            }
          } else {
            triggerNavigation(routeItem);
          }
        } else {
          this.navigateTo(routeItem.redirectTo, state);
        }
      });
    }
  }
}
