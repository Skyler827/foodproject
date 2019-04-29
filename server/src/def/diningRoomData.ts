type Shape = "rectangle" | "oval" | "polygon";

function isShape(x: any): x is Shape {
    return x === "rectangle" || x == "oval" || x == "polygon";
}
function isNumber(x:any): x is number {
    return typeof x == "number";
}
function isString(x: any): x is string {
    return typeof x == "string";
}

class TableData {
    number: number;
    x: number;
    y: number;
    width: number;
    height: number;
    shape: Shape;
    points: Array<{x:number, y:number}>;
    rotate: number;
    rotateUnits: string | undefined;
}

export class DiningRoomData {
    id: number;
    name: string;
    shortName: string;
    units: string;
    width: number;
    length: number;
    tables: Array<TableData>;
};
export function isDrData(obj: any): obj is DiningRoomData {
    for (let prop of ["name", "units", "width", "length", "tables"]) {
        if (obj[prop] == null ) {
            console.log(`dining room is missing property '${prop}'!`);
            return false;
        }
    }
    for (let prop of ["name","units"]) {
        if (!isString(obj[prop])) {
            console.log(`dining room property '${prop}' should be a string, but it's actually a '${typeof obj[prop]}'.`)
            console.log(obj);
            return false;
        }
    }
    for (let prop of ["width", "length"]) {
        if (!isNumber(obj[prop])) {
            console.log(`dining room property '${prop}' should be a number, but instead it's a '${typeof obj[prop]}'.`)
            console.log(obj);
            return false;
        }
    }
    if (!Array.isArray(obj.tables)) {
        console.log(`dining room tables should be an array, but instead it's a '${typeof obj.tables}'.`);
        return false;
    }
    for (let t of obj.tables) {
        for (let prop of ["number", "x", "y", "width", "height"]) {
            if (t[prop] == null) {
                console.log(`a table is missing property '${prop}':`);
                console.log(t);
                return false;
            }
            if (!isNumber(t[prop])) {
                console.log(`table property ${prop} should be a number, but it's actually a '${typeof t[prop]}':`);
                console.log(t);
                return false;
            }
        }
        if (!t.shape) {
            console.log(`table ${t.number} is missing property 'shape':`);
            console.log(t);
            return false;
        }
        if (!isShape(t.shape)) {
            console.log(`table ${t.number} should be one of "rectangle" "square" or "polygon", `+
                `but instead it's ${t.shape}.`);
            return false;
        }
        if (t.shape == "polygon") {
            if (!t.points) {
                console.log(`table ${t.number} is missing the property 'points' even though it's shape is 'polygon'`);
                return false;
            }
            if (!Array.isArray(t.points)) {
                console.log(`table ${t.number}'s property 'points' should be an array, `+
                    `but it's actually ${t.points} of type ${typeof t.points}`);
                return false;
            }
            for (let p of t.points) {
                if (!p.x || !p.y || isNumber(p.x) || isNumber(p.y) ) {
                    console.log(`point '${p}' in table ${t.number} is missing numberic x or y:`);
                    console.log(p);
                    return false;
                }
            }
        }
    }
    return true;
}