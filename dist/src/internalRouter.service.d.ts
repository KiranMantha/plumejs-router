import { ICurrentRoute } from './router.model';
export declare class InternalRouter {
    private _currentRoute;
    private _template;
    private _navigationEndEvent;
    private _routeStateMap;
    listenRouteChanges(): () => void;
    getTemplate(): {
        subscribe: (fn: (value?: string) => void) => () => void;
    };
    getCurrentRoute(): {
        subscribe: (fn: (value?: ICurrentRoute) => void) => () => void;
    };
    navigateTo(path: string, state: Record<string, unknown>): void;
    onNavigationEnd(): {
        subscribe: (fn: (() => void) | ((param: unknown) => void)) => () => void;
    };
    private _registerOnHashChange;
    private _navigateTo;
}
