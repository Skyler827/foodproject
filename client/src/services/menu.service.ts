import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Category } from 'src/classes/category';
import { ItemList, FullMenuItemRecord } from 'src/classes/item';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    constructor(private http: HttpClient) { }
    getCategories(): Promise<Array<Category>> {
        return new Promise((resolve, reject) => {
            this.http.get("/api/categories", {observe:"response"}).subscribe(
                (httpResponse: HttpResponse<Array<Category>>) => {
                    resolve(httpResponse.body);
                }, err => {
                    reject(err);
                }
            );
        });
    }
    getItems(categoryID: string): Promise<ItemList> {
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
    getItemData(itemId: string): Promise<FullMenuItemRecord> {
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
