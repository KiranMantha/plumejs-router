import { Observable, Subject } from "rxjs";
import { ICurrentRoute } from "./router.model";
export declare class InternalRouter {
    _currentRoute: ICurrentRoute;
    _template: Subject<string>;
    constructor();
    getTemplate(): Observable<string>;
    getCurrentRoute(): ICurrentRoute;
    navigateTo(path?: string): void;
    private _registerOnHashChange;
    private _routeMatcher;
    private _navigateTo;
}
