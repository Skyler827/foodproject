import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    ordered_items_by_seat: Array<Array<{
        name:String,
        options:Array<{name:String, priceCents:Number}>,
        priceCents:Number
    }>> = [
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
                    {name:'CC Boat',priceCents:0}
                ]
            }
        ]
    ];
    constructor(private http:HttpClient) { }
    setTable(tableNumber:Number) {
        // return (via a promise) a list of ordered items
    }
    orderItem(itemId:String, seatNumber:Number){
        // add an item to the current order
    }
    takeOrders():Observable<number> {
        return new Observable((subscriber)=>{
            subscriber.next
        });
    }
    submitDineIn()
}
