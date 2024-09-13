const paramRegex = /:([^/]+)/g;

export const getParams = (path: string) => {
  const params = [];
  let match: RegExpExecArray;
  while ((match = paramRegex.exec(path)) !== null) {
    params.push(match[0]);
  }
  return params;
};

const matchPath = (route: string, path: string): boolean => {
  if (route && path) {
    // const pattern = new RegExp(route.replace(/:[^\s/]+/g, '(.+)'));
    const pattern = new RegExp(`^${route.replace(/:[^\s/]+/g, '([^/]+)')}$`);
    return pattern.test(path);
  }
  return false;
};

export { matchPath };
