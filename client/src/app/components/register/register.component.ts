import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

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
    admin: Boolean = false;
    constructor(private ls: LoginService) { }

    ngOnInit() {
    }
    registerSubmit() {
        this.ls.register(this.username,this.password,this.selectedUserType);
    }
    ngOnChanges() {
        console.log(this.username);
        console.log(this.password);
        console.log(this.admin);
    }

}
