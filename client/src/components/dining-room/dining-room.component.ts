import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dining-room',
    templateUrl: './dining-room.component.html',
    styleUrls: ['./dining-room.component.css']
})
export class DiningRoomComponent implements OnInit {

    constructor(private ar: ActivatedRoute) { }
    diningRoomName: string = "";
    test: string;
    ngOnInit() {        
        this.ar.params.subscribe(params => {
            this.test = JSON.stringify(params);
            let n = params.name as string;
            this.diningRoomName = n[0].toUpperCase() + n.substring(1) + " Dining";
        })
    }
}
