import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiningRoom, Table, DiningRoomWithTables } from 'src/classes/diningroom';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    diningRooms: DiningRoom[] = [];
    tables: Table[] = [];
    test: any;
    constructor(private http:HttpClient) {
        this.http.get(`/api/diningrooms/`, {observe:'body'}).subscribe(response => {
            this.diningRooms = (response as DiningRoom[]).sort((a,b)=> a.id-b.id);
        })
    }
    getDiningRoom(diningRoom: number) {
        return new Promise((resolve, reject) => {
            const url = diningRoom ? 
                "/api/diningrooms/":
                "/api/tables";
            this.http.get(url, {
                observe:"response",
                headers: new HttpHeaders({"Accept":"Application/JSON"})
            }).subscribe(response => {
                if (response.status == 200) {
                    console.log(response.body);
                    this.tables = (response.body as DiningRoomWithTables).tables;
                    this.test = JSON.stringify(response.body);
                    resolve(response.body);
                } else reject(response.body);
            }, error => {
                reject(error);
            });
        });
    }
}
