var b = Object.defineProperty;
var _ = (a, t, e) => t in a ? b(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var o = (a, t, e) => _(a, typeof t != "symbol" ? t + "" : t, e);
import { BehaviourSubjectObs as f, SubjectObs as P, fromEvent as O, wrapIntoObservable as g, Injectable as d, Component as S, signal as T, Subscriptions as E } from "@plumejs/core";
const C = /:([^/]+)/g, j = (a) => {
  const t = [];
  let e;
  for (; (e = C.exec(a)) !== null; )
    t.push(e[0]);
  return t;
}, M = (a, t) => a && t ? new RegExp(`^${a.replace(/:[^\s/]+/g, "([^/]+)")}$`).test(t) : !1, u = class u {
  static checkParams(t, e, s) {
    const r = new RegExp(t.replace(/:[^/]+/g, "([^/]+)")), n = e.match(r), i = {};
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
var x = Object.defineProperty, y = Object.getOwnPropertyDescriptor, A = (a, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? y(t, e) : t, n = a.length - 1, i; n >= 0; n--)
    (i = a[n]) && (r = (s ? i(t, e, r) : i(r)) || r);
  return s && r && x(t, e, r), r;
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
    const a = "popstate";
    return window.history.replaceState({}, null, ""), function(t, e) {
      const s = t.pushState;
      t.pushState = function(...r) {
        s.apply(t, r), e();
      };
    }(window.history, this._registerOnHashChange.bind(this)), O(window, a, () => {
      this._registerOnHashChange();
    });
  }
  getTemplate() {
    return this._template.asObservable();
  }
  getCurrentRoute() {
    return this._currentRoute.asObservable();
  }
  navigateTo(a = "/", t = null) {
    const e = window.location.pathname || "/";
    this._routeStateMap.clear(), this._routeStateMap.set(a, t), e === a ? this._navigateTo(a, t) : window.history.pushState(t, "", a);
  }
  onNavigationEnd() {
    return this._navigationEndEvent.asObservable();
  }
  _registerOnHashChange() {
    const a = window.location.pathname, t = this._routeStateMap.get(a);
    this._navigateTo(a, t);
  }
  _navigateTo(a, t) {
    const e = {}, s = a.split("/").filter(Boolean), r = c.routeList.filter((i) => {
      if (i.fragments.length === s.length && M(i.url, a))
        return i;
      if (i.url === a)
        return i;
    }), n = r.length > 0 ? r[0] : null;
    n && (e.path = a, e.state = { ...t || {} }, g(n.canActivate()).subscribe((i) => {
      if (!i) return;
      const l = c.checkParams(n.url, a, n.params);
      if (Object.keys(l).length > 0 || a) {
        e.routeParams = new Map(Object.entries(l));
        const R = new URLSearchParams(window.location.search).entries();
        e.queryParams = new Map(R);
        const h = (m) => {
          m.isRegistered = !0, this._currentRoute.next(e), this._template.next(m.template), this._navigationEndEvent.next(null);
        };
        n.isRegistered ? h(n) : n.templatePath ? g(n.templatePath()).subscribe(() => {
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
    this.internalRouterSrvc.navigateTo(t || "/");
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
var D = Object.defineProperty, I = Object.getOwnPropertyDescriptor, N = (a, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? I(t, e) : t, n = a.length - 1, i; n >= 0; n--)
    (i = a[n]) && (r = (s ? i(t, e, r) : i(r)) || r);
  return s && r && D(t, e, r), r;
};
function w(a, t = "") {
  const e = `${t}/${a.path}`.replace(/\/+/g, "/");
  c.formatRoute({ ...a, path: e }), (a.children || []).forEach((s) => {
    w(s, e);
  });
}
let v = class {
  constructor(a) {
    this.internalRouter = a, L();
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
  static registerRoutes({ routes: a, preloadAllRoutes: t = !1 }) {
    if (Array.isArray(a)) {
      for (const e of a)
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
