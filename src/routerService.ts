//https://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
import { Injectable, isArray } from 'plumejs';
import { isNode } from "browser-or-node";
import { Route, ICurrentRoute } from "./types";
import { StaticRouter } from './staticRouter';
import { InternalRouter } from './internalRouterService';

@Injectable()
export class Router {
	getCurrentRoute: () => ICurrentRoute;
	navigateTo: (path: string) => void;
	constructor(internalRouter: InternalRouter) {
		this.getCurrentRoute = internalRouter.getCurrentRoute.bind(internalRouter);
		this.navigateTo = internalRouter.navigateTo.bind(internalRouter);
	}
	static registerRoutes(routes: Array<Route>) {
		if (!isNode) {
			if (isArray(routes)) {
				for (let route of routes) {
					StaticRouter.formatRoute(route);
				}
			} else {
				throw Error("router.addRoutes: the parameter must be an array");
			}
		}
	}
}
