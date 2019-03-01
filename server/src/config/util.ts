// borrowed from https://stackoverflow.com/a/15030117
function flatten(arr: any[]) {
    return arr.reduce(function (flat, toFlatten) {
          return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
module.exports.flatten = flatten;