import { __decorate } from "tslib";
import { Injectable } from '@plumejs/core';
import { StaticRouter } from './staticRouter';
import { wrapIntoObservable, SubjectObs, fromVanillaEvent } from './utils';
let InternalRouter = class InternalRouter {
    _currentRoute = {
        path: '',
        params: {},
        state: {}
    };
    _template = new SubjectObs();
    _unSubscribeHashEvent;
    startHashChange() {
        this._unSubscribeHashEvent = fromVanillaEvent(window, 'hashchange', () => {
            this._registerOnHashChange();
        });
    }
    stopHashChange() {
        this._unSubscribeHashEvent();
    }
    getTemplate() {
        return this._template.asObservable();
    }
    getCurrentRoute() {
        return this._currentRoute;
    }
    navigateTo(path = '', state) {
        if (path) {
            const windowHash = window.location.hash.replace(/^#/, '');
            if (windowHash === path) {
                this._navigateTo(path, state);
            }
            window.location.hash = '#' + path;
        }
        else {
            this._navigateTo(path, state);
        }
    }
    _registerOnHashChange() {
        const path = window.location.hash.replace(/^#/, '');
        this._navigateTo(path, null);
    }
    _routeMatcher(route, path) {
        if (route) {
            const _matcher = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'));
            return path.match(_matcher);
        }
        else {
            return route === path;
        }
    }
    _navigateTo(path, state) {
        const uParams = path.split('/').filter((h) => {
            return h.length > 0;
        });
        const routeArr = StaticRouter.routeList.filter((route) => {
            if (route.Params.length === uParams.length && this._routeMatcher(route.Url, path)) {
                return route;
            }
            else if (route.Url === path) {
                return route;
            }
        });
        const routeItem = routeArr.length > 0 ? routeArr[0] : null;
        if (routeItem) {
            this._currentRoute.path = path;
            this._currentRoute.state = { ...(state || {}) };
            wrapIntoObservable(routeItem.canActivate()).subscribe((val) => {
                if (!val)
                    return;
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
                    }
                    else {
                        this._template.next(routeItem.Template);
                    }
                }
                else {
                    this.navigateTo(routeItem.redirectTo, state);
                }
            });
        }
    }
};
InternalRouter = __decorate([
    Injectable()
], InternalRouter);
export { InternalRouter };
