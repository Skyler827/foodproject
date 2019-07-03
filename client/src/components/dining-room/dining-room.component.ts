import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../services/table.service';
import { DiningRoomWithOrders } from 'src/classes/diningroom';

const verticalMarginPixels = 100; //about right but probablly a bit off

@Component({
    selector: 'app-dining-room',
    templateUrl: './dining-room.component.html',
    styleUrls: ['./dining-room.component.css']
})
export class DiningRoomComponent implements OnInit {
    diningRoom: DiningRoomWithOrders;
    tableDims: Array<{x:number,y:number,width:number,height:number,number:number,showDialog:boolean,
    color:string,backgroundColor:string}> = [];
    hmargin: number = 10;
    vmargin: number = 10;
    drHeight: number = 100;
    drWidth: number = 100;
    drTop: number = 100;
    drLeft: number = 100;
    constructor(private ar: ActivatedRoute, private ts: TableService) {}
    ngOnInit() {
        this.ar.params.subscribe(params => {
            let name = params.name as string;
            this.ts.reload(name);
            this.diningRoom = this.ts.diningRooms.filter(dr => dr.shortName == name)[0];
            this.size();
        });
    }
    diningRoomIsHorizontal(): boolean {
        const dr = this.diningRoom;
        const doc = document.documentElement;
        return (dr.width * (doc.clientHeight-verticalMarginPixels-2*this.vmargin) > dr.length * (doc.clientWidth-2*this.hmargin));
    }
    @HostListener('window:resize', ['$event'])
    size() {
        const doc = document.documentElement;
        const is_H = this.diningRoomIsHorizontal();
        const scale = is_H ?
            doc.clientWidth/this.diningRoom.width:
            (doc.clientHeight - verticalMarginPixels)/this.diningRoom.length;
        const x0 = is_H ? this.hmargin : (doc.clientWidth - 2*this.hmargin - scale * this.diningRoom.width)/2;
        const y0 = is_H ? (doc.clientHeight - verticalMarginPixels - 2*this.vmargin - scale * this.diningRoom.length)/2 : this.vmargin;
        this.drHeight = is_H ?
            scale * this.diningRoom.length :
            doc.clientHeight - verticalMarginPixels;
        this.drWidth = is_H ?
            doc.clientWidth :
            scale * this.diningRoom.width;
        this.tableDims = this.diningRoom.tables.map(t => ({
            x: scale * t.x,
            y: scale * t.y,
            width: scale * t.width,
            height: scale * t.height,
            number: t.number,
            showDialog: false,
            color: t.orders.length > 0 ? 'white' : 'black',
            backgroundColor: t.orders.length > 0 ? 'green' : 'white'
        }));
        this.drTop = y0;
        this.drLeft = x0;
    }
}
