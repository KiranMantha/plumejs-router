const matchPath = (route: string, path: string): boolean => {
  if (route && path) {
    const pattern = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'));
    return pattern.test(path);
  }
  return false;
};

export { matchPath };
