import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderWithItem, OutstandingOrder, OrderWithItemUI, OutstandingOrderUI } from 'src/classes/order';
import { FullMenuItemRecord } from 'src/classes/item';
import { FullTableRecord } from "src/classes/order";
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
        return new Promise((resolve, reject) =>
            this.http.get(`/api/tables/${tableNumber}`, {observe:"body"}).subscribe((body: FullTableRecord) => {
                const maxSeatNumber = body.seats.reduce(
                    (max: number, curr) => curr.seatNumber > max? curr.seatNumber : max, 0);
                const submittedOrders: Array<Array<OrderWithItemUI>> = new Array(maxSeatNumber + 1);
                for (let seat of body.seats) {
                    submittedOrders[seat.seatNumber] = new Array(seat.itemOrders.length);
                    for (let i=0; i< seat.itemOrders.length; i++) {
                        const order = seat.itemOrders[i];
                        submittedOrders[seat.seatNumber][i] = {
                            id: order.id,
                            option_line: order.optionLine,
                            selected: false,
                            seat: seat.seatNumber,
                            item: order.item,
                            basePriceCents: order.item.priceCents,
                            totalPriceCents: order.item.priceCents,
                            options: [],
                            ingredient_modifiers: []
                        }
                    }
                }
                this.ordered_items_by_seat.next(submittedOrders);
                resolve(null);
            }, error=> reject(error))
        );
    }
    orderItem(item: FullMenuItemRecord):void {
        let newOrder = {
            id: item.id,
            item: item.id,
            itemName: item.name,
            seat: this.currentSeat,
            option_line: null,
            basePriceCents: item.priceCents,
            totalPriceCents: item.priceCents,
            options: [],
            ingredient_modifiers: [],
            selected: false
        }
        let uibs = this.unordered_items_by_seat;
        console.log(uibs);
        console.log(typeof uibs);
        const x = uibs.getValue();
        if (uibs.value[this.currentSeat]) {
            x[this.currentSeat].push(newOrder)
        } else {
            x[this.currentSeat] = [newOrder];            
        }
        uibs.next(x);
    }
    async placeOrder():Promise<void> {
        console.log(this.unordered_items_by_seat.getValue());
        this.http.post(`/api/orders/${this.currentTable}`,this.unordered_items_by_seat.getValue(),{
            observe:"body"
        }).subscribe(o=>{
            console.log(o);
        });
        return Promise.resolve();
    }
}
