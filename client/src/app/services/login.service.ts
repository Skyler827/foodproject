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
    async register(username: String, password: String, userType:String) {
        return new Promise((resolve, reject) => 
            this.http.post("/register", {"username": username, "password":password, "userType":userType})
            .subscribe(resolve, reject)
        );
    }
}
