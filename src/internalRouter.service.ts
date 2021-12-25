import { Injectable, wrapIntoObservable } from '@plumejs/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { ICurrentRoute } from './router.model';
import { StaticRouter } from './staticRouter';

@Injectable()
export class InternalRouter {
  private _currentRoute: ICurrentRoute = {
    path: '',
    params: {},
    state: {}
  };
  private _template = new Subject<string>();
  private _unSubscribeHashEvent;

  startHashChange() {
    this._unSubscribeHashEvent = fromEvent(window, 'hashchange').subscribe(() => {
      this._registerOnHashChange();
    });
  }

  stopHashChange() {
    this._unSubscribeHashEvent();
  }

  getTemplate(): Observable<string> {
    return this._template.asObservable();
  }

  getCurrentRoute(): ICurrentRoute {
    return this._currentRoute;
  }

  navigateTo(path = '', state: Record<string, any>) {
    if (path) {
      const windowHash = window.location.hash.replace(/^#/, '');
      if (windowHash === path) {
        this._navigateTo(path, state);
      }
      window.location.hash = '#' + path;
    } else {
      this._navigateTo(path, state);
    }
  }

  private _registerOnHashChange() {
    const path = window.location.hash.replace(/^#/, '');
    this._navigateTo(path, null);
  }

  private _routeMatcher(route: string, path: string) {
    if (route) {
      const _matcher = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'));
      return path.match(_matcher);
    } else {
      return route === path;
    }
  }

  private _navigateTo(path: string, state: Record<string, any>) {
    const uParams = path.split('/').filter((h) => {
      return h.length > 0;
    });
    const routeArr = StaticRouter.routeList.filter((route) => {
      if (route.Params.length === uParams.length && this._routeMatcher(route.Url, path)) {
        return route;
      } else if (route.Url === path) {
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
          this._currentRoute.params = _params;
          if (!routeItem.IsRegistered) {
            if (routeItem.TemplatePath) {
              wrapIntoObservable(routeItem.TemplatePath()).subscribe(() => {
                routeItem.IsRegistered = true;
                this._template.next(routeItem.Template);
              });
            }
          } else {
            this._template.next(routeItem.Template);
          }
        } else {
          this.navigateTo(routeItem.redirectTo, state);
        }
      });
    }
  }
}
