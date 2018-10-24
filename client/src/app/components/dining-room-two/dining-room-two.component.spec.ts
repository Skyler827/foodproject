import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningRoomTwoComponent } from './dining-room-two.component';

describe('DiningRoomTwoComponent', () => {
  let component: DiningRoomTwoComponent;
  let fixture: ComponentFixture<DiningRoomTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiningRoomTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningRoomTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
