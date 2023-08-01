import { Injectable } from '@plumejs/core';
import { ICurrentRoute } from './router.model';
import { StaticRouter } from './staticRouter';
import { wrapIntoObservable, SubjectObs, fromVanillaEvent, matchPath } from './utils';

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
    this._unSubscribeHashEvent = fromVanillaEvent(window, 'hashchange', () => {
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

  navigateTo(path = '', state: Record<string, any>) {
    this._routeStateMap.clear();
    if (path) {
      const windowHash = window.location.hash.replace(/^#/, '');
      if (windowHash === path) {
        this._navigateTo(path, state);
      }
      this._routeStateMap.set(path, state);
      window.location.hash = '#' + path;
    } else {
      this._navigateTo(path, state);
    }
  }

  private _registerOnHashChange() {
    const path = window.location.hash.replace(/^#/, '');
    const state = this._routeStateMap.get(path);
    this._navigateTo(path, state);
  }

  private _navigateTo(path: string, state: Record<string, any>) {
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
          const entries = window.location.hash.split('?')[1]
            ? new URLSearchParams(window.location.hash.split('?')[1]).entries()
            : [];
          this._currentRoute.queryParams = new Map(entries);
          if (!routeItem.isRegistered) {
            if (routeItem.templatePath) {
              wrapIntoObservable(routeItem.templatePath()).subscribe(() => {
                routeItem.isRegistered = true;
                this._template.next(routeItem.template);
              });
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
