var R = Object.defineProperty;
var b = (a, t, e) => t in a ? R(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var l = (a, t, e) => (b(a, typeof t != "symbol" ? t + "" : t, e), e);
import { BehaviourSubjectObs as f, SubjectObs as _, fromEvent as P, wrapIntoObservable as g, Injectable as v, Component as O, Renderer as C, Subscriptions as y } from "@plumejs/core";
const u = class u {
  static checkParams(t, e) {
    let r = 0;
    const n = {}, i = e.paramCount;
    for (let s = 0; s < t.length; s++) {
      const c = e.params[s];
      c.indexOf(":") >= 0 && (n[c.split(":")[1]] = t[s].split("?")[0], r += 1);
    }
    return r === i ? n : {};
  }
  static getParamCount(t) {
    let e = 0;
    return t.forEach((r) => {
      r.indexOf(":") >= 0 && (e += 1);
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
    if (e.params = t.path.split("/").filter((r) => r.length > 0), e.url = t.path, e.template = "", e.redirectTo = t.redirectTo, t.template) {
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
l(u, "routeList", []), l(u, "isHistoryBasedRouting", !0);
let o = u;
const S = (a, t) => a && t ? new RegExp(a.replace(/:[^\s/]+/g, "(.+)")).test(t) : !1;
var T = Object.defineProperty, E = Object.getOwnPropertyDescriptor, H = (a, t, e, r) => {
  for (var n = r > 1 ? void 0 : r ? E(t, e) : t, i = a.length - 1, s; i >= 0; i--)
    (s = a[i]) && (n = (r ? s(t, e, n) : s(n)) || n);
  return r && n && T(t, e, n), n;
};
let p = class {
  constructor() {
    l(this, "_currentRoute", new f({
      path: "",
      routeParams: /* @__PURE__ */ new Map(),
      queryParams: /* @__PURE__ */ new Map(),
      state: {}
    }));
    l(this, "_template", new f(""));
    l(this, "_navigationEndEvent", new _());
    l(this, "_routeStateMap", /* @__PURE__ */ new Map());
  }
  listenRouteChanges() {
    const a = o.isHistoryBasedRouting ? "popstate" : "hashchange";
    return o.isHistoryBasedRouting && (window.history.replaceState({}, null, ""), function(t, e) {
      const r = t.pushState;
      t.pushState = function(...n) {
        r.apply(t, n), e();
      };
    }(window.history, this._registerOnHashChange.bind(this))), P(window, a, () => {
      this._registerOnHashChange();
    });
  }
  getTemplate() {
    return this._template.asObservable();
  }
  getCurrentRoute() {
    return this._currentRoute.asObservable();
  }
  navigateTo(a = "/", t) {
    let e = o.isHistoryBasedRouting ? window.location.pathname : window.location.hash.replace(/^#/, "");
    e = e || "/", this._routeStateMap.clear(), this._routeStateMap.set(a, t), e === a ? this._navigateTo(a, t) : o.isHistoryBasedRouting ? window.history.pushState(t, "", a) : window.location.hash = "#" + a;
  }
  onNavigationEnd() {
    return this._navigationEndEvent.asObservable();
  }
  _registerOnHashChange() {
    const a = o.isHistoryBasedRouting ? window.location.pathname : window.location.hash.replace(/^#/, ""), t = this._routeStateMap.get(a);
    this._navigateTo(a, t);
  }
  _navigateTo(a, t) {
    const e = {}, r = a.split("/").filter((s) => s.length > 0), n = o.routeList.filter((s) => {
      if (s.params.length === r.length && S(s.url, a))
        return s;
      if (s.url === a)
        return s;
    }), i = n.length > 0 ? n[0] : null;
    i && (e.path = a, e.state = { ...t || {} }, g(i.canActivate()).subscribe((s) => {
      if (!s)
        return;
      const c = o.checkParams(r, i);
      if (Object.keys(c).length > 0 || a) {
        e.routeParams = new Map(Object.entries(c));
        let h = [];
        o.isHistoryBasedRouting ? h = new URLSearchParams(window.location.search).entries() : h = window.location.hash.split("?")[1] ? new URLSearchParams(window.location.hash.split("?")[1]).entries() : [], e.queryParams = new Map(h);
        const m = (d) => {
          d.isRegistered = !0, this._currentRoute.next(e), this._template.next(d.template), this._navigationEndEvent.next(null);
        };
        i.isRegistered ? m(i) : i.templatePath ? g(i.templatePath()).subscribe(() => {
          m(i);
        }) : i.redirectTo && this.navigateTo(i.redirectTo, t);
      } else
        this.navigateTo(i.redirectTo, t);
    }));
  }
};
p = H([
  v()
], p);
class M {
  constructor(t, e) {
    l(this, "_template", "");
    l(this, "_subscriptions", new y());
    this.internalRouterSrvc = t, this.renderer = e;
  }
  beforeMount() {
    this._subscriptions.add(
      this.internalRouterSrvc.getTemplate().subscribe((t) => {
        this._template !== t && (this._template = t);
      })
    ), this._subscriptions.add(this.internalRouterSrvc.listenRouteChanges());
  }
  mount() {
    const t = o.isHistoryBasedRouting ? window.location.pathname : window.location.hash.replace(/^#/, "");
    this.internalRouterSrvc.navigateTo(t || "/", null);
  }
  unmount() {
    this._subscriptions.unsubscribe();
  }
  render() {
    return this._template;
  }
}
const j = () => {
  O({
    selector: "router-outlet",
    deps: [p, C]
  })(M);
};
var B = Object.defineProperty, A = Object.getOwnPropertyDescriptor, x = (a, t, e, r) => {
  for (var n = r > 1 ? void 0 : r ? A(t, e) : t, i = a.length - 1, s; i >= 0; i--)
    (s = a[i]) && (n = (r ? s(t, e, n) : s(n)) || n);
  return r && n && B(t, e, n), n;
};
let w = class {
  constructor(a) {
    this.internalRouter = a, j();
  }
  getCurrentRoute() {
    return this.internalRouter.getCurrentRoute();
  }
  navigateTo(a, t) {
    this.internalRouter.navigateTo(a, t);
  }
  onNavigationEnd() {
    return this.internalRouter.onNavigationEnd();
  }
  static registerRoutes({
    routes: a,
    preloadAllRoutes: t = !1,
    isHashBasedRouting: e = !1
  }) {
    if (e && (o.isHistoryBasedRouting = !e), Array.isArray(a)) {
      for (const r of a)
        o.formatRoute(r);
      t ? o.preloadRoutes() : o.preloadSelectedRoutes();
    } else
      throw Error("router.addRoutes: the parameter must be an array");
  }
};
w = x([
  v({ deps: [p] })
], w);
export {
  w as Router,
  S as matchPath
};
