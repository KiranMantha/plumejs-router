import { Injectable, wrapIntoObservable } from '@plumejs/core';
import { fromEvent, Subject } from 'rxjs';
import { StaticRouter } from './staticRouter';
export class InternalRouter {
    _currentRoute = {
        params: {}
    };
    _template = new Subject();
    constructor() {
        fromEvent(window, 'hashchange').subscribe(() => {
            this._registerOnHashChange();
        });
    }
    getTemplate() {
        return this._template.asObservable();
    }
    getCurrentRoute() {
        return this._currentRoute;
    }
    navigateTo(path = '') {
        if (path) {
            const windowHash = window.location.hash.replace(/^#/, '');
            if (windowHash === path) {
                this._navigateTo(path);
            }
            window.location.hash = '#' + path;
        }
        else {
            this._navigateTo(path);
        }
    }
    _registerOnHashChange() {
        const path = window.location.hash.replace(/^#/, '');
        this._navigateTo(path);
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
    _navigateTo(path) {
        const uParams = path.split('/').filter((h) => {
            return h.length > 0;
        });
        const routeArr = StaticRouter.routList.filter((route) => {
            if (route.Params.length === uParams.length && this._routeMatcher(route.Url, path)) {
                return route;
            }
            else if (route.Url === path) {
                return route;
            }
        });
        const routeItem = routeArr.length > 0 ? routeArr[0] : null;
        if (routeItem) {
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
                    this.navigateTo(routeItem.redirectTo);
                }
            });
        }
    }
}
Injectable("InternalRouter")([InternalRouter]);
