import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataVehicleComponent } from './data-vehicle.component';

describe('DataVehiculeComponent', () => {
  let component: DataVehicleComponent;
  let fixture: ComponentFixture<DataVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
