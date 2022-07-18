export class StaticRouter {
    static routeList = [];
    static checkParams(urlParams, routeItem) {
        let paramMapCount = 0;
        const paramsObject = {}, paramCount = routeItem.ParamCount;
        for (let i = 0; i < urlParams.length; i++) {
            const routeParam = routeItem.Params[i];
            if (routeParam.indexOf(':') >= 0) {
                paramsObject[routeParam.split(':')[1]] = urlParams[i].split('?')[0];
                paramMapCount += 1;
            }
        }
        if (paramMapCount === paramCount) {
            return paramsObject;
        }
        return {};
    }
    static getParamCount(params) {
        let paramCount = 0;
        params.forEach((param) => {
            if (param.indexOf(':') >= 0) {
                paramCount += 1;
            }
        });
        return paramCount;
    }
    static formatRoute(route) {
        const obj = {
            Params: {},
            Url: '',
            Template: '',
            ParamCount: 0,
            IsRegistered: false,
            redirectTo: '',
            canActivate: () => true
        };
        obj.Params = route.path.split('/').filter((str) => {
            return str.length > 0;
        });
        obj.Url = route.path;
        obj.Template = '';
        obj.redirectTo = route.redirectTo;
        if (route.template) {
            if (!route.templatePath)
                throw Error('templatePath is required in route if template is mentioned.');
            obj.Template = route.template;
            obj.TemplatePath = route.templatePath;
        }
        if (route.canActivate)
            obj.canActivate = route.canActivate;
        obj.ParamCount = StaticRouter.getParamCount(obj.Params);
        StaticRouter.routeList.push(obj);
    }
    static preloadRoutes() {
        for (const route of StaticRouter.routeList) {
            route.TemplatePath && route.TemplatePath();
        }
    }
}
