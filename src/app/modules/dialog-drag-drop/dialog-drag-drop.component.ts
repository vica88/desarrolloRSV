import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Posicion } from '@app/_models';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Vehiculo} from '../../_models/vehicles';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { ReplaySubject,Subject} from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-drag-drop',
  templateUrl: './dialog-drag-drop.component.html',
  styleUrls: ['./dialog-drag-drop.component.css']
})
export class DialogDragDropComponent implements OnInit {
  
  public listaVehiculos: Array<Vehiculo> 

  /** control for the selected vehicle */
  public vehicleCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public vehicleFilterCtrl: FormControl = new FormControl();

  /** list of vehicles filtered by search keyword */
  public filteredVehicle: ReplaySubject<Vehiculo[]> = new ReplaySubject<Vehiculo[]>(1);

  @ViewChild('singleSelect',{static: false}) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<DialogDragDropComponent>,
    @Inject(MAT_DIALOG_DATA) {lista}) {

    this.listaVehiculos = lista;
  } 

  ngOnInit() {

     // set initial selection
    /* this.vehicleCtrl.setValue(this.listaVehiculos); */

    // load the initial vehicle list
    this.filteredVehicle.next(this.listaVehiculos.slice()); 

    // listen for search field value changes
    this.vehicleFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVehicles();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

    /**
   * Sets the initial value after the filteredVehicles are loaded initially
   */
  protected setInitialValue() {
    this.filteredVehicle
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredVehicles are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Vehiculo, b: Vehiculo) => a && b && a.idvehiculo === b.idvehiculo;
      });
  }

  protected filterVehicles() {
    if (!this.listaVehiculos) {
      return;
    }
    // get the search keyword 
    let search = this.vehicleFilterCtrl.value; 
    if (!search) {
      this.filteredVehicle.next(this.listaVehiculos.slice());
      return;
    } else {
      //console.log(search) 
      //search = search.toLowerCase(); 
    }
    // filter the vehicles
    this.filteredVehicle.next(
      this.listaVehiculos.filter(vehicle => vehicle.patente.toLowerCase().indexOf(search) > -1 || vehicle.modelo.toLowerCase().indexOf(search) > -1)
    );
  }
}
