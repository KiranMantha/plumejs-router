import { Injectable, fromEvent } from '@plumejs/core';
import { ICurrentRoute } from './router.model';
import { StaticRouter } from './staticRouter';
import { wrapIntoObservable, SubjectObs, matchPath } from './utils';

@Injectable()
export class InternalRouter {
  private _currentRoute: ICurrentRoute = {
    path: '',
    routeParams: new Map(),
    queryParams: new Map(),
    state: {}
  };
  private _template = new SubjectObs<string>();
  private _unSubscribeHashEvent: () => void;
  private _routeStateMap = new Map();

  startHashChange() {
    const event = StaticRouter.isHistoryBasedRouting ? 'popstate' : 'hashchange';
    if (StaticRouter.isHistoryBasedRouting) {
      window.history.replaceState({}, null, '');
      const registerOnHashChange = this._registerOnHashChange.bind(this);
      (function (history) {
        const pushState = history.pushState;
        history.pushState = function (...args) {
          pushState.apply(history, args);
          registerOnHashChange();
        };
      })(window.history);
    }
    this._unSubscribeHashEvent = fromEvent(window, event, () => {
      this._registerOnHashChange();
    });
  }

  stopHashChange() {
    this._unSubscribeHashEvent();
  }

  getTemplate(): { subscribe: (fn: (value?: string) => void) => () => void } {
    return this._template.asObservable();
  }

  getCurrentRoute(): ICurrentRoute {
    return this._currentRoute;
  }

  navigateTo(path = '/', state: Record<string, unknown>) {
    let windowPath = StaticRouter.isHistoryBasedRouting
      ? window.location.pathname
      : window.location.hash.replace(/^#/, '');
    windowPath = windowPath ? windowPath : '/';
    this._routeStateMap.clear();
    this._routeStateMap.set(path, state);
    if (windowPath === path) {
      this._template.next('');
      setTimeout(() => {
        this._navigateTo(path, state);
      });
    } else {
      StaticRouter.isHistoryBasedRouting
        ? window.history.pushState(state, '', path)
        : (window.location.hash = '#' + path);
    }
  }

  private _registerOnHashChange() {
    const path = StaticRouter.isHistoryBasedRouting ? window.location.pathname : window.location.hash.replace(/^#/, '');
    const state = this._routeStateMap.get(path);
    this._navigateTo(path, state);
  }

  private _navigateTo(path: string, state: Record<string, unknown>) {
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
      this._currentRoute.path = path;
      this._currentRoute.state = { ...(state || {}) };
      wrapIntoObservable(routeItem.canActivate()).subscribe((val: boolean) => {
        if (!val) return;
        const _params = StaticRouter.checkParams(uParams, routeItem);
        if (Object.keys(_params).length > 0 || path) {
          this._currentRoute.routeParams = new Map(Object.entries(_params));
          let entries: Iterable<[string, string]> = [];
          if (StaticRouter.isHistoryBasedRouting) {
            entries = new URLSearchParams(window.location.search).entries();
          } else {
            entries = window.location.hash.split('?')[1]
              ? new URLSearchParams(window.location.hash.split('?')[1]).entries()
              : [];
          }
          this._currentRoute.queryParams = new Map(entries);
          if (!routeItem.isRegistered) {
            if (routeItem.templatePath) {
              wrapIntoObservable(routeItem.templatePath()).subscribe(() => {
                routeItem.isRegistered = true;
                this._template.next(routeItem.template);
              });
            } else if (routeItem.redirectTo) {
              this.navigateTo(routeItem.redirectTo, state);
            }
          } else {
            this._template.next(routeItem.template);
          }
        } else {
          this.navigateTo(routeItem.redirectTo, state);
        }
      });
    }
  }
}
