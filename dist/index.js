var b = Object.defineProperty;
var _ = (r, t, e) => t in r ? b(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => (_(r, typeof t != "symbol" ? t + "" : t, e), e);
import { BehaviourSubjectObs as f, SubjectObs as P, fromEvent as O, wrapIntoObservable as g, Injectable as d, Component as S, Renderer as T, signal as C, Subscriptions as E } from "@plumejs/core";
const u = class u {
  static checkParams(t, e, a) {
    const n = new RegExp(t.replace(/:[^/]+/g, "([^/]+)")), s = e.match(n), i = {};
    for (let l = 0; l < a.length; l++)
      i[a[l].replace(":", "")] = s[l + 1];
    return i;
  }
  static getParamCount(t) {
    let e = 0;
    return t.forEach((a) => {
      a.indexOf(":") >= 0 && (e += 1);
    }), e;
  }
  static formatRoute(t) {
    const e = {
      params: {},
      url: "",
      template: "",
      paramCount: 0,
      isRegistered: !1,
      redirectTo: "",
      preload: t.preload,
      canActivate: () => !0
    };
    if (e.params = t.path.split("/").filter((a) => a.length > 0), e.url = t.path, e.template = "", e.redirectTo = t.redirectTo, t.template) {
      if (!t.templatePath)
        throw Error("templatePath is required in route if template is mentioned.");
      e.template = t.template, e.templatePath = t.templatePath;
    }
    t.canActivate && (e.canActivate = t.canActivate), e.paramCount = u.getParamCount(e.params), u.routeList.push(e);
  }
  static preloadRoutes() {
    for (const t of u.routeList)
      t.templatePath && t.templatePath();
  }
  static preloadSelectedRoutes() {
    const t = u.routeList.filter((e) => e.preload === !0);
    for (const e of t)
      e.templatePath && e.templatePath();
  }
};
o(u, "routeList", []);
let c = u;
const j = (r, t) => r && t ? new RegExp(r.replace(/:[^\s/]+/g, "(.+)")).test(t) : !1;
var M = Object.defineProperty, x = Object.getOwnPropertyDescriptor, y = (r, t, e, a) => {
  for (var n = a > 1 ? void 0 : a ? x(t, e) : t, s = r.length - 1, i; s >= 0; s--)
    (i = r[s]) && (n = (a ? i(t, e, n) : i(n)) || n);
  return a && n && M(t, e, n), n;
};
let p = class {
  constructor() {
    o(this, "_currentRoute", new f({
      path: "",
      routeParams: /* @__PURE__ */ new Map(),
      queryParams: /* @__PURE__ */ new Map(),
      state: {}
    }));
    o(this, "_template", new f(""));
    o(this, "_navigationEndEvent", new P());
    o(this, "_routeStateMap", /* @__PURE__ */ new Map());
  }
  listenRouteChanges() {
    const r = "popstate";
    return window.history.replaceState({}, null, ""), function(t, e) {
      const a = t.pushState;
      t.pushState = function(...n) {
        a.apply(t, n), e();
      };
    }(window.history, this._registerOnHashChange.bind(this)), O(window, r, () => {
      this._registerOnHashChange();
    });
  }
  getTemplate() {
    return this._template.asObservable();
  }
  getCurrentRoute() {
    return this._currentRoute.asObservable();
  }
  navigateTo(r = "/", t) {
    let e = window.location.pathname;
    e = e || "/", this._routeStateMap.clear(), this._routeStateMap.set(r, t), e === r ? this._navigateTo(r, t) : window.history.pushState(t, "", r);
  }
  onNavigationEnd() {
    return this._navigationEndEvent.asObservable();
  }
  _registerOnHashChange() {
    const r = window.location.pathname, t = this._routeStateMap.get(r);
    this._navigateTo(r, t);
  }
  _navigateTo(r, t) {
    const e = {}, a = r.split("/").filter((i) => i.length > 0), n = c.routeList.filter((i) => {
      if (i.params.length === a.length && j(i.url, r))
        return i;
      if (i.url === r)
        return i;
    }), s = n.length > 0 ? n[0] : null;
    s && (e.path = r, e.state = { ...t || {} }, g(s.canActivate()).subscribe((i) => {
      if (!i)
        return;
      const l = c.checkParams(s.url, r, s.params);
      if (Object.keys(l).length > 0 || r) {
        e.routeParams = new Map(Object.entries(l));
        const R = new URLSearchParams(window.location.search).entries();
        e.queryParams = new Map(R);
        const h = (m) => {
          m.isRegistered = !0, this._currentRoute.next(e), this._template.next(m.template), this._navigationEndEvent.next(null);
        };
        s.isRegistered ? h(s) : s.templatePath ? g(s.templatePath()).subscribe(() => {
          h(s);
        }) : s.redirectTo && this.navigateTo(s.redirectTo, t);
      } else
        this.navigateTo(s.redirectTo, t);
    }));
  }
};
p = y([
  d()
], p);
class A {
  constructor(t, e) {
    o(this, "_template", C(""));
    o(this, "_subscriptions", new E());
    this.internalRouterSrvc = t, this.renderer = e;
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
    this.internalRouterSrvc.navigateTo(t || "/", null);
  }
  unmount() {
    this._subscriptions.unsubscribe();
  }
  render() {
    return this._template();
  }
}
const L = () => {
  S({
    selector: "router-outlet",
    deps: [p, T]
  })(A);
};
var D = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, I = (r, t, e, a) => {
  for (var n = a > 1 ? void 0 : a ? $(t, e) : t, s = r.length - 1, i; s >= 0; s--)
    (i = r[s]) && (n = (a ? i(t, e, n) : i(n)) || n);
  return a && n && D(t, e, n), n;
};
function w(r, t = "") {
  const e = `${t}/${r.path}`.replace(/\/+/g, "/");
  c.formatRoute({ ...r, path: e }), (r.children || []).forEach((a) => {
    w(a, e);
  });
}
let v = class {
  constructor(r) {
    this.internalRouter = r, L();
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
      for (const e of r)
        w(e);
      t ? c.preloadRoutes() : c.preloadSelectedRoutes();
    } else
      throw Error("router.addRoutes: the parameter must be an array");
  }
};
v = I([
  d({ deps: [p] })
], v);
export {
  v as Router,
  j as matchPath
};
