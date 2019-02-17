import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderWithItem, OutstandingOrder } from 'src/classes/order';
import { FullMenuItemRecord } from 'src/classes/item';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    public ordered_items_by_seat: Array<Array<OrderWithItem>> = [];
    public unordered_items_by_seat: Array<Array<OutstandingOrder>> = [];
    currentSeat: number = 0;
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
    orderItem(item:FullMenuItemRecord):void {
        this.unordered_items_by_seat[this.currentSeat].push({
            _id: item._id,
            seat: this.currentSeat,
            option_line: null,
            basePriceCents: item.priceCents,
            totalPriceCents: item.priceCents,
            options: [],
            ingredient_modifiers: []
        });
        // add an item to the current order
    }
    placeOrder():Promise<void> {
        return Promise.resolve();
    }
}
