import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    tableNum: number = 0;
    currentCategory = "Drinks";
    constructor(private ar: ActivatedRoute) { }

    ngOnInit() {
        this.tableNum = this.ar.params['_value'].n;
    }

}
