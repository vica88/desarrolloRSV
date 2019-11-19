import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentBuscarVehiculoComponent } from './dialog-content-buscar-vehiculo.component';

describe('DialogContentBuscarVehiculoComponent', () => {
  let component: DialogContentBuscarVehiculoComponent;
  let fixture: ComponentFixture<DialogContentBuscarVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogContentBuscarVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentBuscarVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
