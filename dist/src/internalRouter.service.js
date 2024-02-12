import { __decorate } from "tslib";
import { BehaviourSubjectObs, Injectable, SubjectObs, fromEvent, wrapIntoObservable } from '@plumejs/core';
import { StaticRouter } from './staticRouter';
import { matchPath } from './utils';
let InternalRouter = class InternalRouter {
    _currentRoute = new BehaviourSubjectObs({
        path: '',
        routeParams: new Map(),
        queryParams: new Map(),
        state: {}
    });
    _template = new BehaviourSubjectObs('');
    _navigationEndEvent = new SubjectObs();
    _routeStateMap = new Map();
    listenRouteChanges() {
        const event = StaticRouter.isHistoryBasedRouting ? 'popstate' : 'hashchange';
        if (StaticRouter.isHistoryBasedRouting) {
            window.history.replaceState({}, null, '');
            (function (history, fn) {
                const pushState = history.pushState;
                history.pushState = function (...args) {
                    pushState.apply(history, args);
                    fn();
                };
            })(window.history, this._registerOnHashChange.bind(this));
        }
        return fromEvent(window, event, () => {
            this._registerOnHashChange();
        });
    }
    getTemplate() {
        return this._template.asObservable();
    }
    getCurrentRouteInfo() {
        return this._currentRoute.asObservable();
    }
    navigateTo(path = '/', state) {
        let windowPath = StaticRouter.isHistoryBasedRouting
            ? window.location.pathname
            : window.location.hash.replace(/^#/, '');
        windowPath = windowPath ? windowPath : '/';
        this._routeStateMap.clear();
        this._routeStateMap.set(path, state);
        if (windowPath === path) {
            this._navigateTo(path, state);
        }
        else {
            StaticRouter.isHistoryBasedRouting
                ? window.history.pushState(state, '', path)
                : (window.location.hash = '#' + path);
        }
    }
    onNavigationEnd() {
        return this._navigationEndEvent.asObservable();
    }
    _registerOnHashChange() {
        const path = StaticRouter.isHistoryBasedRouting ? window.location.pathname : window.location.hash.replace(/^#/, '');
        const state = this._routeStateMap.get(path);
        this._navigateTo(path, state);
    }
    _navigateTo(path, state) {
        const currentRouteData = {};
        const uParams = path.split('/').filter((h) => {
            return h.length > 0;
        });
        const routeArr = StaticRouter.routeList.filter((route) => {
            if (route.params.length === uParams.length && matchPath(route.url, path)) {
                return route;
            }
            else if (route.url === path) {
                return route;
            }
        });
        const routeItem = routeArr.length > 0 ? routeArr[0] : null;
        if (routeItem) {
            currentRouteData.path = path;
            currentRouteData.state = { ...(state || {}) };
            wrapIntoObservable(routeItem.canActivate()).subscribe((val) => {
                if (!val)
                    return;
                const _params = StaticRouter.checkParams(uParams, routeItem);
                if (Object.keys(_params).length > 0 || path) {
                    currentRouteData.routeParams = new Map(Object.entries(_params));
                    let entries = [];
                    if (StaticRouter.isHistoryBasedRouting) {
                        entries = new URLSearchParams(window.location.search).entries();
                    }
                    else {
                        entries = window.location.hash.split('?')[1]
                            ? new URLSearchParams(window.location.hash.split('?')[1]).entries()
                            : [];
                    }
                    currentRouteData.queryParams = new Map(entries);
                    const triggerNavigation = (routeItem) => {
                        routeItem.isRegistered = true;
                        this._currentRoute.next(currentRouteData);
                        this._template.next(routeItem.template);
                        this._navigationEndEvent.next(null);
                    };
                    if (!routeItem.isRegistered) {
                        if (routeItem.templatePath) {
                            wrapIntoObservable(routeItem.templatePath()).subscribe(() => {
                                triggerNavigation(routeItem);
                            });
                        }
                        else if (routeItem.redirectTo) {
                            this.navigateTo(routeItem.redirectTo, state);
                        }
                    }
                    else {
                        triggerNavigation(routeItem);
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
