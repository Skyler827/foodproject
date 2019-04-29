export class Table {
    number: number;
    shape: "rectangle" | "oval" | "polygon"
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    rotateUnits: string | undefined;
    points: Array<{x:number,y:number}>;
}
export class DiningRoom {
    id: number;
    name: string;
    shortName: string;
    width: number;
    length: number;
    units: string;
}
export class DiningRoomWithTables extends DiningRoom {
    tables: Table[];
}