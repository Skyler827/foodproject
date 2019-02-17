import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { OrderService } from 'src/services/order.service';
import { OrderWithItem } from 'src/classes/order';
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
    order_items: Array<Array<OrderWithItem>> = [];
    itemIdToBeModified: string = null;

    constructor(private ar: ActivatedRoute, private ms:MenuService, private os:OrderService) {
        
    }
    ngOnInit() {
        this.tableNum = this.ar.params['_value'].n;
        this.os.setTable(this.tableNum).then(()=>{
            this.order_items = this.os.ordered_items_by_seat;
        });
        this.ms.getCategories().then(category_data => {
            category_data.forEach(category_obj => {
                this.categories.push({
                    name:category_obj.name,
                    id:category_obj._id
                });
            });
        });
    }

}
