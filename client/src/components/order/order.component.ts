import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { OrderService } from 'src/services/order.service';
import { OrderWithItem, OrderWithItemUI, OutstandingOrder, OutstandingOrderUI } from 'src/classes/order';
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

    constructor(private ar: ActivatedRoute, private ms:MenuService, private os:OrderService) {
        
    }
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
    selectSeat(i: number): void {
        this.os.currentSeat = i;
    }
    selectOrderedItem(seatNumber: number, itemIndex: number): void {
        this.os.ordered_items_by_seat.next(((x) => {
            x[seatNumber][itemIndex].selected = !x[seatNumber][itemIndex].selected;
            return x;
        })(this.os.ordered_items_by_seat.getValue()));
    }
    selectUnOrderedItem(seatNumber: number, itemIndex: number): void {
        this.os.unordered_items_by_seat.next((x=>{
            x[seatNumber][itemIndex].selected = !x[seatNumber][itemIndex].selected;
            return x;
        })(this.os.unordered_items_by_seat.getValue()));
    }
    repeatSelected(): void {
        this.os.ordered_items_by_seat.next((x=>{
            for (let seat of x) {
                let additionalOrders: Array<OrderWithItemUI> = [];
                for (let order of seat) {
                    if (order.selected) {
                        order.selected = false;
                        additionalOrders.push(order);
                    }
                }
                additionalOrders.forEach(order => seat.push(order));
            }
            return x;
        })(this.os.ordered_items_by_seat.getValue()));

        this.os.unordered_items_by_seat.next((x=>{
            for (let seat of x) {
                let additionalOrders:Array<OutstandingOrderUI> = [];
                for (let order of seat) {
                    if (order.selected) {
                        order.selected = false;
                        additionalOrders.push(order);
                    }
                }
                additionalOrders.forEach(order => seat.push(order));
            }
            return x;
        })(this.os.unordered_items_by_seat.getValue()));
    }
    deleteSelected(): void {
        this.os.unordered_items_by_seat.next((x=>
            x.map(seat => seat.filter(order => !order.selected))
        )(this.os.unordered_items_by_seat.getValue()));
    }
}
