import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private ms:MenuService) { }
  categories = [];
  menu_items = [];
  ngOnInit() {
    this.ms.getCategories().then(categories => this.categories = categories);
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
