var R = Object.defineProperty;
var w = (r, t, e) => t in r ? R(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var c = (r, t, e) => w(r, typeof t != "symbol" ? t + "" : t, e);
import { BehaviourSubjectObs as g, SubjectObs as P, fromEvent as T, wrapIntoObservable as d, Injectable as _, Component as O, signal as E, Subscriptions as S } from "@plumejs/core";
const A = /:([^/]+)/g, C = (r) => {
  const t = [];
  let e;
  for (; (e = A.exec(r)) !== null; )
    t.push(e[0]);
  return t;
}, B = (r, t) => r && t ? new RegExp(`^${r.replace(/:[^\s/]+/g, "([^/]+)")}$`).test(t) : !1;
function x(r, t) {
  const a = r.split("?")[0].split("/").filter(Boolean);
  for (const n of t) {
    const s = n.fragments;
    if (s.length >= a.length || s.includes("*")) {
      const o = {};
      let h = !0;
      for (let i = 0; i < s.length; i++) {
        const l = s[i], m = a[i];
        if (l === "*") {
          h = !0;
          break;
        }
        if (!m && l !== "*") {
          h = !1;
          break;
        }
        if (l.startsWith(":"))
          o[l.substring(1)] = m;
        else if (l !== m) {
          h = !1;
          break;
        }
      }
      if (h) {
        const i = Object.fromEntries(
          new URLSearchParams(window.location.search).entries()
        );
        return { route: n, routeData: { path: r, routeParams: o, queryParams: i } };
      }
    }
  }
  return null;
}
const y = `
  <div style='text-align: center'>
    <h1>404</h1>
    <h3>not Found</h3>
  </div>
`, p = class p {
  static formatRoute(t) {
    const e = {
      fragments: [],
      params: C(t.path),
      path: t.path,
      template: "",
      templatePath: null,
      paramCount: 0,
      isRegistered: !1,
      redirectTo: t.redirectTo,
      preload: t.preload,
      canActivate: () => !0
    };
    e.fragments = t.path.split("/").filter((a) => a.length > 0), t.template && (e.template = t.template, e.templatePath = t.templatePath), t.canActivate && (e.canActivate = t.canActivate), e.paramCount = e.params.length, p.routeList.push(e);
  }
  static preloadRoutes() {
    for (const t of p.routeList)
      t.templatePath && t.templatePath();
  }
  static preloadSelectedRoutes() {
    const t = p.routeList.filter((e) => e.preload === !0);
    for (const e of t)
      e.templatePath && e.templatePath();
  }
};
c(p, "routeList", []);
let u = p;
var L = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, j = (r, t, e, a) => {
  for (var n = a > 1 ? void 0 : a ? $(t, e) : t, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (n = (a ? o(t, e, n) : o(n)) || n);
  return a && n && L(t, e, n), n;
};
let f = class {
  constructor() {
    c(this, "_currentRoute", new g({
      path: "",
      routeParams: {},
      queryParams: {},
      state: {}
    }));
    c(this, "_template", new g(""));
    c(this, "_navigationEndEvent", new P());
    c(this, "_routeStateMap", /* @__PURE__ */ new Map());
  }
  listenRouteChanges() {
    const r = "popstate";
    return window.history.replaceState({}, null, ""), function(t, e) {
      const a = t.pushState;
      t.pushState = function(...n) {
        a.apply(t, n), e();
      };
    }(window.history, this._registerOnHashChange.bind(this)), T(window, r, () => {
      this._registerOnHashChange();
    });
  }
  getTemplate() {
    return this._template.asObservable();
  }
  getCurrentRoute() {
    return this._currentRoute.asObservable();
  }
  navigateTo(r = "/", t = null) {
    const e = window.location.pathname || "/";
    this._routeStateMap.clear(), this._routeStateMap.set(r, t), e === r ? this._navigateTo(r, t) : window.history.pushState(t, "", r);
  }
  onNavigationEnd() {
    return this._navigationEndEvent.asObservable();
  }
  _registerOnHashChange() {
    const r = window.location.pathname, t = this._routeStateMap.get(r);
    this._navigateTo(r, t);
  }
  _navigateTo(r, t) {
    const e = x(r, u.routeList);
    if (e) {
      const a = e.route, { routeParams: n, queryParams: s } = e.routeData, o = {
        path: r,
        state: { ...t || {} },
        routeParams: n,
        queryParams: s
      };
      d(a.canActivate()).subscribe((h) => {
        if (h)
          if (r) {
            const i = (l) => {
              l.isRegistered = !0, this._currentRoute.next(o), this._template.next(l.template), this._navigationEndEvent.next(null);
            };
            a.isRegistered ? i(a) : a.templatePath ? d(a.templatePath()).subscribe(() => {
              i(a);
            }) : a.redirectTo ? this.navigateTo(a.redirectTo, t) : i(a);
          } else
            this.navigateTo(a.redirectTo, t);
      });
    } else {
      const a = u.routeList.find((n) => n.path === "/404");
      a ? this._navigateTo(a.path, t) : (this._template.next(y), this._navigationEndEvent.next(null));
    }
  }
};
f = j([
  _()
], f);
class D {
  constructor(t) {
    c(this, "_template", E(""));
    c(this, "_subscriptions", new S());
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
const M = () => {
  O({
    selector: "router-outlet",
    deps: [f]
  })(D);
};
var N = Object.defineProperty, F = Object.getOwnPropertyDescriptor, I = (r, t, e, a) => {
  for (var n = a > 1 ? void 0 : a ? F(t, e) : t, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (n = (a ? o(t, e, n) : o(n)) || n);
  return a && n && N(t, e, n), n;
};
function b(r, t = "") {
  const e = `${t}/${r.path}`.replace(/\/+/g, "/");
  u.formatRoute({ ...r, path: e }), (r.children || []).forEach((a) => {
    b({ ...a, canActivate: r.canActivate }, e);
  });
}
let v = class {
  constructor(r) {
    this.internalRouter = r, M();
  }
  getCurrentRoute() {
    return this.internalRouter.getCurrentRoute();
  }
  navigateTo(r, t) {
    this.internalRouter.navigateTo(r, t);
  }
  onNavigationEnd() {
    return this.internalRouter.onNavigationEnd();
  }
  static registerRoutes({ routes: r, preloadAllRoutes: t = !1 }) {
    if (Array.isArray(r)) {
      for (const e of r) {
        if (!e.template && !e.redirectTo && !(e.children || []).length)
          throw Error("A route should have either a template or redirectTo path or child routes.");
        if (!e.template && !e.redirectTo && (e.children || []).length) {
          const a = e.children.find((n) => n.redirectTo);
          e.redirectTo = `${e.path}/${(a == null ? void 0 : a.redirectTo) ?? e.children[0].path}`.replace(
            "//",
            "/"
          );
        }
        b(e);
      }
      t ? u.preloadRoutes() : u.preloadSelectedRoutes(), console.log(u.routeList);
    } else
      throw Error("router.addRoutes: the parameter must be an array");
  }
};
v = I([
  _({ deps: [f] })
], v);
export {
  v as Router,
  B as matchPath
};
