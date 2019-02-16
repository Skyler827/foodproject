import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Category } from '../../classes/category';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private ms:MenuService) { }
  selectedCategory: number = 0;
  categories: Array<Category> = [];
  menu_items = [];
  ngOnInit() {
    this.ms.getCategories().then(categories => {
      this.categories = categories;
      for (let i=0; i< categories.length; i++) {
        this.categories[i].selected = false;
      }
    });
  }
  SelectCategory(newIndex:number) {
    let newSelection = this.categories[newIndex];
    newSelection.selected = true;
    this.categories[this.selectedCategory].selected = false;
    this.selectedCategory = newIndex;
    this.ms.getItems(newSelection._id).then((itemRecords)=>{
        this.menu_items = itemRecords.map(i=>({name:i.name,id:i._id}));
    });
  }
  SelectItem(itemId:string) {
    this.ms.getItemData(itemId).then(itemRecord=>{
        if (itemRecord.options.length > 0) {}
    });
  }

}
