import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CategoryWithSelected } from '../../classes/category';
import { FullMenuItemRecord } from 'src/classes/item';
import { OrderService } from 'src/services/order.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private ms:MenuService, private os:OrderService) { }
  selectedCategory: number = 0;
  categories: Array<CategoryWithSelected> = [];
  menu_items = [];
  ngOnInit() {
    this.ms.getCategories().then(categories => {
      this.categories = categories.map(category =>
        Object.assign({}, category, {selected:false}));
        this.selectCategory(0);
    });
  }
  selectCategory(newIndex:number) {
    let newSelection = this.categories[newIndex];
    newSelection.selected = true;
    this.categories[this.selectedCategory].selected = false;
    this.selectedCategory = newIndex;
    this.ms.getItems(newSelection._id).then((itemRecords)=>{
        this.menu_items = itemRecords.map(i=>({name:i.name,id:i._id}));
        console.log(this.menu_items);
    });
  }
  selectItem(itemId:string) {
    this.ms.getItemData(itemId).then(itemRecord=>{
      console.log(itemRecord);
      console.log("yay!");
      this.os.orderItem(itemRecord);
    });
  }

}
