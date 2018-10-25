import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http:HttpClient) { }
    async login(username: String, password: String) {
        return new Promise((resolve, reject) => {
            this.http.post("/login", {"username":username, "password":password})
            .subscribe(resolve, reject);
        });
    }
    async register(username: String, password: String, admin:Boolean) {
        return new Promise((resolve, reject) => 
            this.http.post("/register", {"username": username, "password":password, admin})
            .subscribe(resolve, reject)
        );
    }
}
