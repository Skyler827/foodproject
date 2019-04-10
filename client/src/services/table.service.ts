import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    tables = [];
    constructor(private http:HttpClient) { }
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
                    resolve(response.body);
                } else reject(response.body);
            }, error => {
                reject(error);
            });
        });
    }
}
