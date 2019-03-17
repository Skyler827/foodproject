import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string = "";
    password: string = "";
    status: string = "";
    error: string = "";
    constructor(private ls: LoginService, private router: Router) {
    }
    ngOnInit() {
    }
    loginButtonClick() {
        this.ls.login(this.username, this.password).then(() => {
            console.log("login succesful")
            this.router.navigateByUrl("/dining-1");
        }, (err) => {
            this.error = err.toString();
        });
    }

}
