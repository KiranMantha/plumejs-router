import { BehaviourSubjectObs, fromEvent, Injectable, SubjectObs, wrapIntoObservable } from '@plumejs/core';
import { CurrentRoute, InternalRouteItem } from './router.model';
import { StaticRouter } from './staticRouter';
import { matchRoute, PAGE_NOT_FOUND_TEMPLATE } from './utils';

@Injectable()
export class InternalRouter {
  private _currentRoute = new BehaviourSubjectObs<CurrentRoute>({
    path: '',
    routeParams: {},
    queryParams: {},
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

  getCurrentRoute(): { subscribe: (fn: (value?: CurrentRoute) => void) => () => void } {
    return this._currentRoute.asObservable();
  }

  navigateTo(path = '/', state: Record<string, unknown> = null) {
    const windowPath = window.location.pathname || '/';
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
    const selectedRoute = matchRoute(path, StaticRouter.routeList);

    if (selectedRoute) {
      const routeItem = selectedRoute.route;
      const { routeParams, queryParams } = selectedRoute.routeData;
      const currentRouteData: CurrentRoute = {
        path,
        state: { ...(state || {}) },
        routeParams,
        queryParams
      };

      wrapIntoObservable(routeItem.canActivate()).subscribe((val: boolean) => {
        if (!val) return;
        if (path) {
          const triggerNavigation = (routeItem: InternalRouteItem) => {
            routeItem.isRegistered = true;
            this._currentRoute.next(currentRouteData as CurrentRoute);
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
            } else {
              triggerNavigation(routeItem);
            }
          } else {
            triggerNavigation(routeItem);
          }
        } else {
          this.navigateTo(routeItem.redirectTo, state);
        }
      });
    } else {
      const notFoundRoute = StaticRouter.routeList.find((route) => route.path === '/404');
      if (notFoundRoute) {
        this._navigateTo(notFoundRoute.path, state);
      } else {
        this._template.next(PAGE_NOT_FOUND_TEMPLATE);
        this._navigationEndEvent.next(null);
      }
    }
  }
}
