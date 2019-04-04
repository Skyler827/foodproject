import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/services/order.service';
import { OrderWithItemUI, OutstandingOrderUI } from 'src/classes/order';
@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    
    //State variable declarations:
    tableNum: number = 0;
    currentCategory = "Drinks";
    categories: Array<{name:String, id:String}> = [];
    selected_category: Number = 0;
    menu_items: Array<{name:String, id:String}> = [];
    order_items: Array<Array<OrderWithItemUI>> = [];
    unordered_items: Array<Array<OutstandingOrderUI>> = [];
    itemIdToBeModified: string = null;

    constructor(private ar: ActivatedRoute, private os:OrderService) {}
    ngOnInit() {
        this.tableNum = this.ar.params['_value'].n;
        this.os.setTable(this.tableNum).then(()=>{
            this.os.ordered_items_by_seat.subscribe(next=>{
                this.order_items = next;
            });
            this.os.unordered_items_by_seat.subscribe(next=>{
                this.unordered_items = next;
            });
        });
    }
    ngOnDestroy() {
        this.os.ordered_items_by_seat.next([]);
        this.os.unordered_items_by_seat.next([]);
    }
    empty() {
        return (this.order_items.filter(seat_list => seat_list.length > 0).length == 0
        ) && (this.unordered_items.filter(seat_list=>seat_list.length > 0).length == 0);
    }
    selectSeat(i: number): void {
        this.os.currentSeat = i;
    }
    selectOrderedItem(seatNumber: number, itemIndex: number): void {
        this.os.ordered_items_by_seat.next(((orders) => {
            orders[seatNumber][itemIndex].selected = !orders[seatNumber][itemIndex].selected;
            return orders;
        })(this.os.ordered_items_by_seat.getValue()));
    }
    selectUnorderedItem(seatNumber: number, itemIndex: number): void {
        this.os.unordered_items_by_seat.next((x=>{
            x[seatNumber][itemIndex].selected = !x[seatNumber][itemIndex].selected;
            return x;
        })(this.os.unordered_items_by_seat.getValue()));
    }
    repeatSelected(): void {
        this.os.unordered_items_by_seat.next(((ordered, unordered)=>{
            for (let i=0; i<ordered.length; i++) {
                let seat = ordered[i];
                let additionalOrders: Array<OutstandingOrderUI> = [];
                for (let order of seat) {
                    if (order.selected) {
                        additionalOrders.push(Object.assign({}, order, {
                            itemName: order.item.name,
                            item: order.item.id,
                            seat: i,
                            selected: false
                        }));
                    }
                }
                additionalOrders.forEach(order => unordered[i].push(order));
            }
            for (let seat of unordered) {
                let additionalOrders: Array<OutstandingOrderUI> = [];
                for (let order of seat) {
                    if (order.selected) {
                        order.selected = false;
                        additionalOrders.push(order);
                    }
                }
                additionalOrders.forEach(order => seat.push(order));
            }
            return unordered;
        })(this.os.ordered_items_by_seat.getValue(), this.os.unordered_items_by_seat.getValue()));
        this.os.ordered_items_by_seat.next((allOrders=>
            allOrders.map(seat=>
                seat.map(order=>
                    Object.assign(order,{selected:false})))
        )(this.os.ordered_items_by_seat.getValue()));
    }
    deleteSelected(): void {
        this.os.unordered_items_by_seat.next((x=>
            x.map(seat => seat.filter(order => !order.selected))
        )(this.os.unordered_items_by_seat.getValue()));
    }
    async greenOk(): Promise<void> {
        this.os.placeOrder();
    }
    async dineIn(): Promise<void> {
        this.os.placeOrder();
    }
    async singleApp(): Promise<void> {
        this.os.placeOrder();
    }
    async takeOut(): Promise<void> {
        this.os.placeOrder();
    }
    async noMake(): Promise<void> {
        this.os.placeOrder();
    }
}
