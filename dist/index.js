var b = Object.defineProperty;
var _ = (r, t, e) => t in r ? b(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => _(r, typeof t != "symbol" ? t + "" : t, e);
import { BehaviourSubjectObs as g, SubjectObs as P, fromEvent as O, wrapIntoObservable as f, Injectable as d, Component as S, signal as T, Subscriptions as E } from "@plumejs/core";
const C = /:([^/]+)/g, j = (r) => {
  const t = [];
  let e;
  for (; (e = C.exec(r)) !== null; )
    t.push(e[0]);
  return t;
}, M = (r, t) => r && t ? new RegExp(`^${r.replace(/:[^\s/]+/g, "([^/]+)")}$`).test(t) : !1, u = class u {
  static checkParams(t, e, s) {
    const a = new RegExp(t.replace(/:[^/]+/g, "([^/]+)")), n = e.match(a), i = {};
    for (let l = 0; l < s.length; l++)
      i[s[l].replace(":", "")] = n[l + 1];
    return i;
  }
  static formatRoute(t) {
    const e = {
      fragments: [],
      params: j(t.path),
      url: t.path,
      template: "",
      paramCount: 0,
      isRegistered: !1,
      redirectTo: t.redirectTo,
      preload: t.preload,
      canActivate: () => !0
    };
    if (e.fragments = t.path.split("/").filter((s) => s.length > 0), t.template) {
      if (!t.templatePath) throw Error("templatePath is required in route if template is mentioned.");
      e.template = t.template, e.templatePath = t.templatePath;
    }
    t.canActivate && (e.canActivate = t.canActivate), e.paramCount = e.params.length, u.routeList.push(e);
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
var x = Object.defineProperty, y = Object.getOwnPropertyDescriptor, A = (r, t, e, s) => {
  for (var a = s > 1 ? void 0 : s ? y(t, e) : t, n = r.length - 1, i; n >= 0; n--)
    (i = r[n]) && (a = (s ? i(t, e, a) : i(a)) || a);
  return s && a && x(t, e, a), a;
};
let p = class {
  constructor() {
    o(this, "_currentRoute", new g({
      path: "",
      routeParams: /* @__PURE__ */ new Map(),
      queryParams: /* @__PURE__ */ new Map(),
      state: {}
    }));
    o(this, "_template", new g(""));
    o(this, "_navigationEndEvent", new P());
    o(this, "_routeStateMap", /* @__PURE__ */ new Map());
  }
  listenRouteChanges() {
    const r = "popstate";
    return window.history.replaceState({}, null, ""), function(t, e) {
      const s = t.pushState;
      t.pushState = function(...a) {
        s.apply(t, a), e();
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
    const e = {}, s = r.split("/").filter((i) => i.length > 0), a = c.routeList.filter((i) => {
      if (i.fragments.length === s.length && M(i.url, r))
        return i;
      if (i.url === r)
        return i;
    }), n = a.length > 0 ? a[0] : null;
    n && (e.path = r, e.state = { ...t || {} }, f(n.canActivate()).subscribe((i) => {
      if (!i) return;
      const l = c.checkParams(n.url, r, n.params);
      if (Object.keys(l).length > 0 || r) {
        e.routeParams = new Map(Object.entries(l));
        const R = new URLSearchParams(window.location.search).entries();
        e.queryParams = new Map(R);
        const h = (m) => {
          m.isRegistered = !0, this._currentRoute.next(e), this._template.next(m.template), this._navigationEndEvent.next(null);
        };
        n.isRegistered ? h(n) : n.templatePath ? f(n.templatePath()).subscribe(() => {
          h(n);
        }) : n.redirectTo && this.navigateTo(n.redirectTo, t);
      } else
        this.navigateTo(n.redirectTo, t);
    }));
  }
};
p = A([
  d()
], p);
class $ {
  constructor(t) {
    o(this, "_template", T(""));
    o(this, "_subscriptions", new E());
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
    deps: [p]
  })($);
};
var D = Object.defineProperty, I = Object.getOwnPropertyDescriptor, N = (r, t, e, s) => {
  for (var a = s > 1 ? void 0 : s ? I(t, e) : t, n = r.length - 1, i; n >= 0; n--)
    (i = r[n]) && (a = (s ? i(t, e, a) : i(a)) || a);
  return s && a && D(t, e, a), a;
};
function w(r, t = "") {
  const e = `${t}/${r.path}`.replace(/\/+/g, "/");
  c.formatRoute({ ...r, path: e }), (r.children || []).forEach((s) => {
    w(s, e);
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
v = N([
  d({ deps: [p] })
], v);
export {
  v as Router,
  M as matchPath
};
