import { Subject } from "rxjs";
import { ICurrentRoute } from "./router.model";
export declare class InternalRouter {
    currentRoute: ICurrentRoute;
    $templateSubscriber: Subject<unknown>;
    constructor();
    private _registerOnHashChange;
    private _routeMatcher;
    private _navigateTo;
    getCurrentRoute(): ICurrentRoute;
    navigateTo(path?: string): void;
}
