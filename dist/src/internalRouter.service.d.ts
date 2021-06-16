import { Observable } from 'rxjs';
import { ICurrentRoute } from './router.model';
export declare class InternalRouter {
    private _currentRoute;
    private _template;
    constructor();
    getTemplate(): Observable<string>;
    getCurrentRoute(): ICurrentRoute;
    navigateTo(path?: string): void;
    private _registerOnHashChange;
    private _routeMatcher;
    private _navigateTo;
}
