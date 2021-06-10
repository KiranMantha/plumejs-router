import { Injectable, wrapIntoObservable } from "@plumejs/core";
import { fromEvent, Observable, Subject } from "rxjs";
import { ICurrentRoute } from "./router.model";
import { StaticRouter } from "./staticRouter";

@Injectable()
export class InternalRouter {
	_currentRoute: ICurrentRoute = {
		params: {},
	};
	_template = new Subject<string>();

	constructor() {
		fromEvent(window, "hashchange").subscribe(() => {
			this._registerOnHashChange();
		});
	}

	getTemplate(): Observable<string> {
		return this._template.asObservable();
	}

	getCurrentRoute(): ICurrentRoute {
		return this._currentRoute;
	}

	navigateTo(path: string = "") {
		if (path) {
			let windowHash = window.location.hash.replace(/^#/, "");
			if (windowHash === path) {
				this._navigateTo(path);
			}
			window.location.hash = "#" + path;
		} else {
			this._navigateTo(path);
		}
	}

	private _registerOnHashChange() {
		const path = window.location.hash.replace(/^#/, "");
		this._navigateTo(path);
	}

	private _routeMatcher(route: string, path: string) {
		if (route) {
			let _matcher = new RegExp(route.replace(/:[^\s/]+/g, "([\\w-]+)"));
			return path.match(_matcher);
		} else {
			return route === path;
		}
	}

	private _navigateTo(path: string) {
		let uParams = path.split("/").filter((h) => {
			return h.length > 0;
		});
		let routeArr = StaticRouter.routList.filter((route) => {
			if (
				route.Params.length === uParams.length &&
				this._routeMatcher(route.Url, path)
			) {
				return route;
			} else if (route.Url === path) {
				return route;
			}
		});
		let routeItem = routeArr.length > 0 ? routeArr[0] : null;
		if (routeItem) {
			wrapIntoObservable(routeItem.canActivate()).subscribe((val: boolean) => {
				if (!val) return;
				let _params = StaticRouter.checkParams(uParams, routeItem);
				if (Object.keys(_params).length > 0 || path) {
					this._currentRoute.params = _params;
					if (!routeItem.IsRegistered) {
						if (routeItem.TemplatePath) {
							wrapIntoObservable(routeItem.TemplatePath()).subscribe(
								(res: any) => {
									routeItem.IsRegistered = true;
									this._template.next(routeItem.Template);
								}
							);
						}
					} else {
						this._template.next(routeItem.Template);
					}
				} else {
					this.navigateTo(routeItem.redirectTo);
				}
			});
		}
	}
}
