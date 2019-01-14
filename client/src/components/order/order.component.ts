import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../services/menu.service';
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
    
    //State variable initialization:
    constructor(private ar: ActivatedRoute, private ms:MenuService) { }
    ngOnInit() {
        this.tableNum = this.ar.params['_value'].n;
        this.ms.getCategories().then(category_data => {
            category_data.forEach(category_obj => {
                this.categories.push({
                    name:category_obj.name,
                    id:category_obj._id
                });
            });
        });
    }
    SelectCategory(category_id:String) {
        this.ms.getItems(category_id).then((itemRecords)=>{
            this.menu_items = itemRecords.map(i=>({name:i.name,id:i._id}));
        });
    }
    SelectItem(itemId:String) {
        this.ms.getItemData(itemId).then(itemRecord=>{
            if (itemRecord.options.length > 0) {}
        });
    }

}