import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    userTypes: String[] = ["manager", "bartender", "cook", "server", "cashier", "customer"];
    selectedUserType: String = "";
    username: String = "";
    password: String = "";
    error: String = "default error message";
    constructor(private ls: LoginService, private r:Router) { }

    ngOnInit() {
    }
    registerSubmit() {
        this.ls.register(this.username,this.password,this.selectedUserType)
        .then((response)=>{
            this.error = JSON.stringify(response);
            this.r.navigateByUrl("/dining-1");
        })
        .catch((response)=>{
            this.error = response.body.message;
        });
    }
    ngOnChanges() {
        console.log(this.username);
        console.log(this.password);
    }

}
