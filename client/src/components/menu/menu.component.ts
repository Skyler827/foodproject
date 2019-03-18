import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CategoryWithSelected } from '../../classes/category';
import { OrderService } from 'src/services/order.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    constructor(private ms: MenuService, private os: OrderService) { }
    selectedCategory: number = 0;
    categories: Array<CategoryWithSelected> = [];
    menu_items = [];
    ngOnInit() {
        this.ms.getCategories().then(categories => {
            this.categories = categories.map(category =>
                Object.assign({}, category, {selected: false}));
            this.selectCategory(0);
        }).catch(err => {
            console.log("error in component initialization:");
            console.log(err);
        });
    }
    selectCategory(newIndex: number) {
        console.log(`calling selectCategory(${newIndex}) when categories is ${this.categories}`);
        this.categories[this.selectedCategory].selected = false;
        this.selectedCategory = newIndex;
        let newSelection = this.categories[newIndex];
        newSelection.selected = true;
        this.ms.getItems(newSelection.id).then((itemRecords) => {
            this.menu_items = itemRecords.map(i => ({name: i.name, id: i.id}));
            console.log(this.menu_items);
        }).catch(err => {
            console.log("error in requesting a category:");
            console.log(err);
        });
    }
    selectItem(itemId: number) {
        if (!itemId) {
            console.log("itemId is undefined! bad stuff is happening because you clicked this!");
        }
        this.ms.getItemData(itemId).then(itemRecord=>{
            this.os.orderItem(itemRecord);
        });
    }

}
