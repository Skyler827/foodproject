import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

type ObjectID = String;
type ItemType = {_id:String, name:String};
type ItemList = Array<ItemType>
type Ingredients = Array<{
    _id: ObjectID,
    quantity: Number,
    unit: String,
    id: String
}>;
type FullMenuItemRecord = {
    options: Array<ObjectID>,
    _id: ObjectID,
    name: String,
    price: Number,
    ingredients: Ingredients,
    category: ObjectID,
    __v: Number
};

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(private http:HttpClient) { }
    getCategories(): Promise<ItemList> {
        return new Promise((resolve, reject) => {
            this.http.get("/api/categories", {observe:"response"}).subscribe(
                (httpResponse: HttpResponse<ItemList>) => {
                    resolve(httpResponse.body as ItemList);
                }, err => {
                    reject(err);
                }
            );
        });
    }
    getItems(categoryID:String): Promise<ItemList> {
        return new Promise((resolve, reject)=>{
            this.http.get(
                `/api/categories/${categoryID}/items/`,
                {observe:"response"}
            ).subscribe(
                (httpResponse: HttpResponse<ItemList>) => resolve(httpResponse.body),
                err => reject(err)
            );
        });
    }
    getItemData(itemId:String): Promise<FullMenuItemRecord> {
        return new Promise((resolve, reject) => {
            this.http.get(`/api/items/${itemId}`, {observe:"response"}
            ).subscribe(
                (httpResponse: HttpResponse<FullMenuItemRecord>) =>
                    resolve(httpResponse.body),
                err => reject(err)
            )
        });
    }
}
