const matchPath = (route, path) => {
    if (route && path) {
        const pattern = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'));
        return pattern.test(path);
    }
    return false;
};
export { matchPath };
