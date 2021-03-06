import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { TableService } from '../services/table.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    loggedIn: boolean = false;
    constructor(private ls:LoginService, private ts:TableService) {}
    ngOnInit() {}
    
    logOut() {
        this.ls.logOut();
    }
}
