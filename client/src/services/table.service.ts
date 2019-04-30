import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiningRoom, DiningRoomWithTables, DiningRoomWithOrders } from 'src/classes/diningroom';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    diningRooms: DiningRoomWithOrders[];
    constructor(private http:HttpClient) {
        this.http.get(`/api/diningrooms/`, {observe:'body'}).subscribe(response => {
            const diningRoomsWithoutTables = (response as DiningRoom[]).sort((a,b)=> a.id-b.id);
            Promise.all(diningRoomsWithoutTables.map(dr => new Promise((resolve, reject)=>{
                this.http.get("/api/diningrooms/"+dr.id, {observe: "body"}).subscribe(resolve,reject);
            }))).then(result => {
                this.diningRooms = result as DiningRoomWithOrders[];
            });
        })
    }
    getDiningRoomShortName(tableNumber: number): string {
        for (let dr of this.diningRooms) {
            for (let table of dr.tables) {
                if (table.number == tableNumber) {
                    return dr.shortName;
                }
            }
        }
        throw new Error("No dining room with a table number "+tableNumber+".");
    }
    reload(name: string) {
        let dr = this.diningRooms.filter(dr => dr.shortName == name)[0];
        this.http.get(`/api/diningrooms/${dr.id}`, {observe:'body'}).subscribe(response => {
            const resp = response as DiningRoomWithOrders;
            dr.tables = resp.tables;
        });
    }

}
