import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderWithItem, OutstandingOrder, OrderWithItemUI, OutstandingOrderUI } from 'src/classes/order';
import { FullMenuItemRecord } from 'src/classes/item';
import { BehaviorSubject } from 'rxjs';

type allOutstandingOrders = Array<Array<OutstandingOrderUI>>;
type allSubmittedOrders = Array<Array<OrderWithItemUI>>;
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    public ordered_items_by_seat: BehaviorSubject<allSubmittedOrders> = new BehaviorSubject([]);
    public unordered_items_by_seat: BehaviorSubject<allOutstandingOrders> = new BehaviorSubject([]);
    currentSeat: number = 0;
    currentTable: number = 0;
    constructor(private http:HttpClient) {}
    setTable(tableNumber:number): Promise<void> {
        this.currentTable = tableNumber;
        return new Promise((resolve, reject)=>
            this.http.get(`/api/tables/${tableNumber}`, {observe:"body"}).subscribe((body) => {
                this.ordered_items_by_seat.next((body as Array<Array<OrderWithItem>>)
                .map(seatList=>
                    seatList? seatList.map(order=>
                        Object.assign({selected:false},order)):[]));
                resolve(null);
            }, error=> reject(error))
        );
    }
    orderItem(item:FullMenuItemRecord):void {
        let newOrder = {
            _id: item._id,
            item: item._id,
            itemName: item.name,
            seat: this.currentSeat,
            option_line: null,
            basePriceCents: item.priceCents,
            totalPriceCents: item.priceCents,
            options: [],
            ingredient_modifiers: [],
            selected: false
        }
        let ibs = this.unordered_items_by_seat;
        console.log(ibs);
        console.log(typeof ibs);
        let x = ibs.getValue();
        if (ibs.value[this.currentSeat]) {
            x[this.currentSeat].push(newOrder)
        } else {
            x[this.currentSeat] = [newOrder];            
        }
        ibs.next(x);
    }
    placeOrder():Promise<void> {
        let orders:request_body = this.unordered_items_by_seat.getValue().reduce((prev, next)=>prev,[])
        this.http.post(`/api/orders/${this.currentTable}`,);
        return Promise.resolve();
    }
}
