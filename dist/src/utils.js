const matchPath = (route, path) => {
    if (route && path) {
        const pattern = new RegExp(route.replace(/:[^\s/]+/g, '(.+)'));
        return pattern.test(path);
    }
    return false;
};
export { matchPath };
