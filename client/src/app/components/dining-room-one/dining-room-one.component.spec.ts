import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningRoomOneComponent } from './dining-room-one.component';

describe('DiningRoomOneComponent', () => {
  let component: DiningRoomOneComponent;
  let fixture: ComponentFixture<DiningRoomOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiningRoomOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningRoomOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
