import { Component, OnInit, ViewEncapsulation, ViewChild, Inject, Optional, Input } from '@angular/core';
import { Vehiculo } from '@app/_models/vehicles';
import { FormControl } from '@angular/forms';
import { VehicleService } from '@app/_services/vehicle.service';
import { MapCommand } from '@app/_models/mapcommand';
import { InteractionWithMapService } from '../../_services/interaction-with-map.service';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-content-buscar-vehiculo',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dialog-content-buscar-vehiculo.component.html',
  styleUrls: ['./dialog-content-buscar-vehiculo.component.css']
})
export class DialogContentBuscarVehiculoComponent implements OnInit {
  
  @Input() data
  public listaVehiculos: Array<Vehiculo> 
  public vehiculosCtrl = new FormControl(); 
  public vehicleFilterCtrl: FormControl = new FormControl();
  public listaVehiculosFiltro: ReplaySubject<Vehiculo[]> = new ReplaySubject<Vehiculo[]>(1);
  public listaVehiculosSeleccionados: ReplaySubject<Vehiculo[]> = new ReplaySubject<Vehiculo[]>(1);
  public selectedValue: Array<Vehiculo>;

  @ViewChild('multipleSelect',{static: false}) multipleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(
    private vehiculosService: VehicleService,
    private interactionMap: InteractionWithMapService,
  ) { 

  }

  select(listaDeVehiculos){
    const dataVehiculos = new MapCommand()
    dataVehiculos.accion = "vehiculos seleccionados"
    var listaId = listaDeVehiculos.map(function(id){
      return id.idvehiculo
    })
    if (listaDeVehiculos != null){
      this.listaVehiculosSeleccionados.next(listaDeVehiculos.slice())
    }
    dataVehiculos.params = { idVehiculosSeleccionados: listaId}
    this.interactionMap.changeMessage(dataVehiculos)
  }

  borrarDeLista(idvehiculo){
    for(let i=0; i < this.vehiculosCtrl.value.length; i++){
      if (this.vehiculosCtrl.value[i].idvehiculo == idvehiculo){
        this.vehiculosCtrl.value.splice( i, 1 )
        this.vehiculosCtrl.setValue(this.vehiculosCtrl.value)
      } 
      if (this.vehiculosCtrl.value != null){
        this.listaVehiculosSeleccionados.next(this.vehiculosCtrl.value.slice())
      }
    }
  }
  
  ngOnInit() {
  
    this.listaVehiculos = this.data

    // load the initial vehicle list
    this.listaVehiculosFiltro.next(this.listaVehiculos.slice()); 

    // listen for search field value changes
    this.vehicleFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVehicles();
      });
  }

  protected filterVehicles() {
    if (!this.listaVehiculosFiltro) {
      return;
    }
    // get the search keyword 
    let search = this.vehicleFilterCtrl.value; 
    if (!search) {
      this.listaVehiculosFiltro.next(this.listaVehiculos.slice());
      return;
    } else {
      //console.log(search) 
      //search = search.toLowerCase(); 
    }
    // filter the vehicles
    this.listaVehiculosFiltro.next(
      this.listaVehiculos.filter(vehicle => vehicle.patente.toLowerCase().indexOf(search) > -1 || vehicle.modelo.toLowerCase().indexOf(search) > -1)
    );
  } 

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  } 

  protected setInitialValue() {
    this.listaVehiculosFiltro
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredVehicles are loaded initially
        // and after the mat-option elements are available
        this.multipleSelect.compareWith = (a: Vehiculo, b: Vehiculo) => a && b && a.idvehiculo === b.idvehiculo;
      });
  }
}
