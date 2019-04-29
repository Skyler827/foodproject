import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiningRoom, Table, DiningRoomWithTables } from 'src/classes/diningroom';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    diningRoomsWithoutTables: DiningRoom[] = [];
    diningRooms: DiningRoomWithTables[];
    constructor(private http:HttpClient) {
        this.http.get(`/api/diningrooms/`, {observe:'body'}).subscribe(response => {
            this.diningRoomsWithoutTables = (response as DiningRoom[]).sort((a,b)=> a.id-b.id);
            Promise.all(this.diningRoomsWithoutTables.map(dr => new Promise((resolve, reject)=>{
                this.http.get("/api/diningrooms/"+dr.id, {observe: "body"}).subscribe(resolve,reject);
            }))).then(result => {
                this.diningRooms = result as DiningRoomWithTables[];
            });
        })
    }
}
