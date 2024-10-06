var b = Object.defineProperty;
var w = (e, t, a) => t in e ? b(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var u = (e, t, a) => w(e, typeof t != "symbol" ? t + "" : t, a);
import { BehaviourSubjectObs as g, SubjectObs as P, fromEvent as O, wrapIntoObservable as v, Injectable as _, Component as E, signal as S, Subscriptions as T } from "@plumejs/core";
const C = /:([^/]+)/g, x = (e) => {
  const t = [];
  let a;
  for (; (a = C.exec(e)) !== null; )
    t.push(a[0]);
  return t;
}, B = (e, t) => e && t ? new RegExp(`^${e.replace(/:[^\s/]+/g, "([^/]+)")}$`).test(t) : !1;
function y(e, t) {
  const r = e.split("?")[0].split("/").filter(Boolean);
  for (const n of t) {
    const s = n.fragments;
    if (s.length >= r.length || s.includes("*")) {
      const i = {};
      let h = !0;
      for (let o = 0; o < s.length; o++) {
        const l = s[o], m = r[o];
        if (l === "*") {
          h = !0;
          break;
        }
        if (!m && l !== "*") {
          h = !1;
          break;
        }
        if (l.startsWith(":"))
          i[l.substring(1)] = m;
        else if (l !== m) {
          h = !1;
          break;
        }
      }
      if (h) {
        const o = Object.fromEntries(
          new URLSearchParams(window.location.search).entries()
        );
        return { route: n, routeData: { path: e, routeParams: i, queryParams: o } };
      }
    }
  }
  return null;
}
const A = `
  <div style='text-align: center'>
    <h1>404</h1>
    <h3>not Found</h3>
  </div>
`, p = class p {
  static formatRoute(t) {
    const a = {
      fragments: [],
      params: x(t.path),
      path: t.path,
      template: "",
      paramCount: 0,
      isRegistered: !1,
      redirectTo: t.redirectTo,
      preload: t.preload,
      canActivate: () => !0
    };
    if (a.fragments = t.path.split("/").filter((r) => r.length > 0), t.template) {
      if (!t.templatePath) throw Error("templatePath is required in route if template is mentioned.");
      a.template = t.template, a.templatePath = t.templatePath;
    }
    t.canActivate && (a.canActivate = t.canActivate), a.paramCount = a.params.length, p.routeList.push(a);
  }
  static preloadRoutes() {
    for (const t of p.routeList)
      t.templatePath && t.templatePath();
  }
  static preloadSelectedRoutes() {
    const t = p.routeList.filter((a) => a.preload === !0);
    for (const a of t)
      a.templatePath && a.templatePath();
  }
};
u(p, "routeList", []);
let c = p;
var j = Object.defineProperty, D = Object.getOwnPropertyDescriptor, L = (e, t, a, r) => {
  for (var n = r > 1 ? void 0 : r ? D(t, a) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (n = (r ? i(t, a, n) : i(n)) || n);
  return r && n && j(t, a, n), n;
};
let f = class {
  constructor() {
    u(this, "_currentRoute", new g({
      path: "",
      routeParams: {},
      queryParams: {},
      state: {}
    }));
    u(this, "_template", new g(""));
    u(this, "_navigationEndEvent", new P());
    u(this, "_routeStateMap", /* @__PURE__ */ new Map());
  }
  listenRouteChanges() {
    const e = "popstate";
    return window.history.replaceState({}, null, ""), function(t, a) {
      const r = t.pushState;
      t.pushState = function(...n) {
        r.apply(t, n), a();
      };
    }(window.history, this._registerOnHashChange.bind(this)), O(window, e, () => {
      this._registerOnHashChange();
    });
  }
  getTemplate() {
    return this._template.asObservable();
  }
  getCurrentRoute() {
    return this._currentRoute.asObservable();
  }
  navigateTo(e = "/", t = null) {
    const a = window.location.pathname || "/";
    this._routeStateMap.clear(), this._routeStateMap.set(e, t), a === e ? this._navigateTo(e, t) : window.history.pushState(t, "", e);
  }
  onNavigationEnd() {
    return this._navigationEndEvent.asObservable();
  }
  _registerOnHashChange() {
    const e = window.location.pathname, t = this._routeStateMap.get(e);
    this._navigateTo(e, t);
  }
  _navigateTo(e, t) {
    const a = y(e, c.routeList);
    if (a) {
      const r = a.route, { routeParams: n, queryParams: s } = a.routeData, i = {
        path: e,
        state: { ...t || {} },
        routeParams: n,
        queryParams: s
      };
      v(r.canActivate()).subscribe((h) => {
        if (h)
          if (e) {
            const o = (l) => {
              l.isRegistered = !0, this._currentRoute.next(i), this._template.next(l.template), this._navigationEndEvent.next(null);
            };
            r.isRegistered ? o(r) : r.templatePath ? v(r.templatePath()).subscribe(() => {
              o(r);
            }) : r.redirectTo && this.navigateTo(r.redirectTo, t);
          } else
            this.navigateTo(r.redirectTo, t);
      });
    } else {
      const r = c.routeList.find((n) => n.path === "/404");
      r ? this._navigateTo(r.path, t) : (this._template.next(A), this._navigationEndEvent.next(null));
    }
  }
};
f = L([
  _()
], f);
class M {
  constructor(t) {
    u(this, "_template", S(""));
    u(this, "_subscriptions", new T());
    this.internalRouterSrvc = t;
  }
  beforeMount() {
    this._subscriptions.add(
      this.internalRouterSrvc.getTemplate().subscribe((t) => {
        this._template() !== t && this._template.set(t);
      })
    ), this._subscriptions.add(this.internalRouterSrvc.listenRouteChanges());
  }
  mount() {
    const t = window.location.pathname;
    this.internalRouterSrvc.navigateTo(t || "/");
  }
  unmount() {
    this._subscriptions.unsubscribe();
  }
  render() {
    return this._template();
  }
}
const $ = () => {
  E({
    selector: "router-outlet",
    deps: [f]
  })(M);
};
var N = Object.defineProperty, q = Object.getOwnPropertyDescriptor, F = (e, t, a, r) => {
  for (var n = r > 1 ? void 0 : r ? q(t, a) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (n = (r ? i(t, a, n) : i(n)) || n);
  return r && n && N(t, a, n), n;
};
function R(e, t = "") {
  const a = `${t}/${e.path}`.replace(/\/+/g, "/");
  c.formatRoute({ ...e, path: a }), (e.children || []).forEach((r) => {
    R(r, a);
  });
}
let d = class {
  constructor(e) {
    this.internalRouter = e, $();
  }
  getCurrentRoute() {
    return this.internalRouter.getCurrentRoute();
  }
  navigateTo(e, t) {
    this.internalRouter.navigateTo(e, t);
  }
  onNavigationEnd() {
    return this.internalRouter.onNavigationEnd();
  }
  static registerRoutes({ routes: e, preloadAllRoutes: t = !1 }) {
    if (Array.isArray(e)) {
      for (const a of e)
        R(a);
      t ? c.preloadRoutes() : c.preloadSelectedRoutes();
    } else
      throw Error("router.addRoutes: the parameter must be an array");
  }
};
d = F([
  _({ deps: [f] })
], d);
export {
  d as Router,
  B as matchPath
};
