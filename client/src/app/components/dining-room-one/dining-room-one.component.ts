import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dining-room-one',
    templateUrl: './dining-room-one.component.html',
    styleUrls: ['./dining-room-one.component.css']
})
export class DiningRoomOneComponent implements OnInit {

    constructor(private router:Router) { }

    ngOnInit() {

    }
    viewTable(tableNum:number) {
        this.router.navigateByUrl("/tables/"+tableNum);
    }
}
