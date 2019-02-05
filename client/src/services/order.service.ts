import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Order } from 'src/classes/order';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    ordered_items_by_seat: Array<Order> = [
        [//for table - Seat 0
            {
                name:'Ultimate Nachos',
                priceCents: 999,
                options:[
                    {name:'No Sour Cream', priceCents:0}
                ]
            }
        ],[//order_pane[1] -> seat 1
            {
                name: '20OZ Drink',
                priceCents: 299,
                options: []
            },{
                name:'Trad Wings Small',
                priceCents: 1179,
                options:[
                    {name:'Honey BBQ', priceCents:0},
                    {name:'Asain Zing', priceCents:0},
                    {name:'CC Boat', priceCents:0},
                    {name:'CC Boat', priceCents:0},
                    {name:'CC Boat', priceCents:0}
                ]
            }
        ]
    ];
    takeOrders: Observable<Order> = new Observable((subscriber) => {});
    constructor(private http:HttpClient) { }
    setTable(tableNumber:Number): Promise<void> {
        return new Promise((resolve, reject)=>
            this.http.get('', {observe:"body"}).subscribe((body) => {
                try {
                    this.ordered_items_by_seat = body;
                } catch (e){

                }
                resolve(null);
            }, (error) => {
                reject(error);
            }));
    }
    orderItem(itemId:String, seatNumber:Number){
        // add an item to the current order
    }
    placeOrder(o: Array<Order>):void {

    }
}
