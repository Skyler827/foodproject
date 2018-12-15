import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dining-room-two',
  templateUrl: './dining-room-two.component.html',
  styleUrls: ['./dining-room-two.component.css']
})
export class DiningRoomTwoComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  viewTable(tableNum:number) {
    this.router.navigateByUrl("/tables/"+tableNum);
  }

}
