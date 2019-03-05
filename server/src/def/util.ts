// borrowed from https://stackoverflow.com/a/15030117
export function flatten(arr: any[]) {
    return arr.reduce(function (flat, toFlatten) {
          return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

export function camelCaseToSnakeCase(s: string) {
    return s.split(/(?=[A-Z])/).join('_').toLowerCase();
}
