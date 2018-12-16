import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor() { }
    getCategories() {}
    getItems(category:String) {}
    getIngredients(itemId:String) {}
    getOptions(itemId:String) {}
}
