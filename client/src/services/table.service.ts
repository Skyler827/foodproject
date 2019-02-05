import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    constructor(private http:HttpClient) { }
    getTables(diningRoom: number) {
        return new Promise((resolve, reject) => {
            let url = "/api/tables";
            if (diningRoom) url += "?diningroom="+diningRoom; 
            this.http.get(url, {
                observe:"response",
                headers: new HttpHeaders({"Accept":"Application/JSON"})
            }).subscribe(response => {
                if (response.status == 200) 
                    resolve(response.body);
                else reject(response.body);
            }, error => {
                reject(error);
            });
        });
    }
    getDiningRoom1() {
        return this.getTables(1);
    }
    getDiningRoom2() {
        return this.getTables(2);
    }
}
