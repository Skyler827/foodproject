import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../services/table.service';
import { DiningRoom } from 'src/classes/diningroom';
@Component({
    selector: 'app-dining-room',
    templateUrl: './dining-room.component.html',
    styleUrls: ['./dining-room.component.css']
})
export class DiningRoomComponent implements OnInit {
    diningRoom: DiningRoom;
    constructor(private ar: ActivatedRoute, private ts: TableService) {
    }
    ngOnInit() {
        this.ar.params.subscribe(params => {
            let name = params.name as string;
            this.diningRoom = this.ts.diningRooms.filter(dr => dr.shortName == name)[0];
            this.ts.getDiningRoom(this.diningRoom.id);
        })
    }
}
