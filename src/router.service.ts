//https://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
import { Injectable } from '@plumejs/core';
import { isNode } from "browser-or-node";
import { InternalRouter } from './internalRouter.service';
import { ICurrentRoute, Route } from "./router.model";
import { StaticRouter } from './staticRouter';

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
			if (Array.isArray(routes)) {
				for (let route of routes) {
					StaticRouter.formatRoute(route);
				}
			} else {
				throw Error("router.addRoutes: the parameter must be an array");
			}
		}
	}
}
