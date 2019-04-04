import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderWithItemUI, OutstandingOrderUI, NewOrderResponse } from 'src/classes/order';
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
    async setTable(tableNumber:number): Promise<void> {
        this.currentTable = tableNumber;
        let ordersBySeat: FullTableRecord = await new Promise<FullTableRecord>(async (resolve, reject) => {
            console.log("no orders on table yet, carry on...");
            this.http.get(`/api/tables/${tableNumber}`)
            .subscribe(_body=>{resolve(null)}, err=>{
                if (err instanceof TypeError) {
                    console.log("type handled correctly");
                } else {
                    console.log(typeof err);
                    console.log(err);
                }
                resolve(null);
            },() => console.log("http request cpomplete"));
        });
        const maxSeatNumber = ordersBySeat? ordersBySeat.seats.reduce(
            (max: number, curr) => curr.seatNumber > max? curr.seatNumber : max, 0) : -1;
        const submittedOrders: Array<Array<OrderWithItemUI>> = new Array(maxSeatNumber + 1);
        for (let seatOrders of ordersBySeat ? ordersBySeat.seats : []) {
            submittedOrders[seatOrders.seatNumber] = new Array(seatOrders.itemOrders.length);
            for (let i=0; i< seatOrders.itemOrders.length; i++) {
                const order = seatOrders.itemOrders[i];
                submittedOrders[seatOrders.seatNumber][i] = {
                    id: order.id,
                    option_line: order.optionLine,
                    selected: false,
                    seat: seatOrders.seatNumber,
                    item: order.item,
                    basePriceCents: order.item.priceCents,
                    totalPriceCents: order.item.priceCents,
                    options: [],
                    ingredient_modifiers: []
                }
            }
        }
        for (let i=0; i<=maxSeatNumber; i++) {
            if (!submittedOrders[i]) submittedOrders[i] = [];
        }
        this.ordered_items_by_seat.next(submittedOrders);
    }
    orderItem(item: FullMenuItemRecord): void {
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
        const uibs = this.unordered_items_by_seat.getValue();
        if (uibs[this.currentSeat]) {
            uibs[this.currentSeat].push(newOrder)
        } else {
            uibs[this.currentSeat] = [newOrder];
        }
        this.unordered_items_by_seat.next(uibs);
    }
    async placeOrder() {
        console.log(this.unordered_items_by_seat.getValue());
        let newOrders: Array<Array<NewOrderResponse>> = await this.http.post(`/api/orders/${this.currentTable}`,this.unordered_items_by_seat.getValue(),{
            observe:"body"
        }).toPromise() as Array<Array<NewOrderResponse>>;
        console.log(newOrders);
        this.unordered_items_by_seat.next([]);
        let orders = this.ordered_items_by_seat.getValue();
        for (let seatList of newOrders) {
            for (let o of seatList) {
                orders[o.seat.seatNumber].push({
                    selected:false,
                    seat: o.seat.seatNumber,
                    id: o.id,
                    item: o.item,
                    option_line: o.optionLine,
                    options: [],
                    ingredient_modifiers: [],
                    basePriceCents: o.item.priceCents,
                    totalPriceCents: o.item.priceCents
                });
            }
        }
        this.ordered_items_by_seat.next(orders);
        return 0;
    }
}
