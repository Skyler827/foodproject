class TableData {
    number: number;
    x: number;
    y: number;
    width: number;
    height: number;
    shape: "rectangle" | "oval" | "polygon";
    points: Array<{x:number, y:number}>;
    rotate: number;
    rotateUnits: string | undefined;
}
export class DiningRoomData {
    name: string;
    units: string;
    width: number;
    length: number;
    tables: Array<TableData>;
};
export function isDrData(obj: any): obj is DiningRoomData {
    for (let prop of ["name","units"]) {
        if (!obj[prop] || typeof obj[prop] !== "string" ) return false;
    }
    for (let prop of ["width", "length"]) {
        if (!obj[prop] || typeof obj[prop] !== "number") return false;
    }
    if (!obj.tables || !Array.isArray(obj.tables)) return false;
    for (let t of obj.tables) {
        for (let prop of ["number", "x", "y", "width", "height"]) {
            if (!t[prop] || typeof t[prop] !== "number") return false;
        }
        if (!t.shape || !(t.shape === "rectangle" || t.shape === "oval" || t.shape === "polygon")) return false;
        if (!t.points || !Array.isArray(t.points)) return false;
        for (let p of t.points) {
            if (!p.x || !p.y || typeof p.x !== "number" 
            || typeof p.y !== "number" ) return false;
        }
        
    }
    return true;
}