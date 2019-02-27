function strMapToObj<K,V>(map:Map<K,V>) {
    let obj = Object.create(null);
    for (let k in map) {
        obj[k] = map.get(k);
    }
    return obj;
}
function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
function strMapToJson(strMap) {
    return JSON.stringify(strMapToObj(strMap));
}
function jsonToStrMap(jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
}