import { ICurrentRoute } from './router.model';
export declare class InternalRouter {
    private _currentRoute;
    private _template;
    private _unSubscribeHashEvent;
    private _routeStateMap;
    startHashChange(): void;
    stopHashChange(): void;
    getTemplate(): {
        subscribe: (fn: (value?: string) => void) => () => void;
    };
    getCurrentRoute(): ICurrentRoute;
    navigateTo(path: string, state: Record<string, any>): void;
    private _registerOnHashChange;
    private _navigateTo;
}
