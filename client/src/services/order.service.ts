import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderWithItem, OrderWithoutItem } from 'src/classes/order';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    public ordered_items_by_seat: Array<Array<OrderWithItem>> = [];
    public unordered_items_by_seat: Array<Array<OrderWithItem>> = [];
    constructor(private http:HttpClient) { }
    setTable(tableNumber:Number): Promise<void> {
        return new Promise((resolve, reject)=>
            this.http.get(`/api/tables/${tableNumber}`, {observe:"body"}).subscribe((body) => {
                console.log(body);
                console.log();
                this.ordered_items_by_seat = body as Array<Array<OrderWithItem>>;
                resolve(null);
            }, error=> reject(error))
        );
    }
    orderItem(itemId:String, seatNumber:Number):void {
        // add an item to the current order
    }
    placeOrder():Promise<void> {
        return Promise.resolve();
    }
}
