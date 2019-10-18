import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Posicion } from '@app/_models';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Vehiculo } from '../../_models/vehicles';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { ReplaySubject,Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { InteractionWithMapService } from '../../_services/interaction-with-map.service';
import * as moment from 'moment'
import { MapCommand } from '@app/_models/mapcommand';

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

  // datos que se pasan al servicio
  public fechaDesde: Date;
  public fechaHasta: Date;
  public fDesde: string;
  public fHasta: string;
  public horaDesde: string;
  public horaHasta: string;

  constructor(
    private interactionMap: InteractionWithMapService,
    private dialogRef: MatDialogRef<DialogDragDropComponent>,
    @Inject(MAT_DIALOG_DATA) {lista}) {

    this.listaVehiculos = lista;
  } 

  ngOnInit() {

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

  verOnline(){
    //se hace el bindeo de las fechas que se ingresan en el calendario

    this.fDesde = this.fechaDesde.getFullYear().toString() + '-' + 
    (this.fechaDesde.getMonth()+1).toString() + '-' + 
    this.fechaDesde.getDate().toString();

    this.fHasta = this.fechaHasta.getFullYear().toString() + '-' + 
    (this.fechaHasta.getMonth()+1).toString() + '-' + 
    this.fechaHasta.getDate().toString();
    
    //FECHA DESDE 

    // sacamos los guiones a la fecha
  
    let anio = parseInt(this.fDesde.split("-")[0]);
    let mes = parseInt(this.fDesde.split("-")[1]) - 1;
    let dia = parseInt(this.fDesde.split("-")[2]);
    
    // sacamos los dos puntos a la hora

    let hora = parseInt(this.horaDesde.split(":")[0])
    let minutos = parseInt(this.horaDesde.split(":")[1])

    //armamos la fecha con la hora

    let fechaHoraDesde = new Date(anio,mes,dia,hora,minutos)
   
    //FECHA HASTA 

    // sacamos los guiones a la fecha
  
    let anio2 = parseInt(this.fHasta.split("-")[0]);
    let mes2 = parseInt(this.fHasta.split("-")[1])-1;
    let dia2 = parseInt(this.fHasta.split("-")[2]);
    
    // sacamos los dos puntos a la hora

    let hora2 = parseInt(this.horaHasta.split(":")[0])
    let minutos2 = parseInt(this.horaHasta.split(":")[1])

    //armamos la fecha con la hora

    let fechaHoraHasta = new Date(anio2,mes2,dia2,hora2,minutos2)
    
    // hacemos la diferencia de la fecha hasta - fecha desde 
    let fTotal = fechaHoraHasta.getTime() - fechaHoraDesde.getTime()

    // pasamos los milesegundos a segundos, minutos, horas y dia(s)
    
    let seconds = fTotal / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;  

    // obtenemos el resultado a pasarle al data (formato "dia horas:minutos")  
    let resultadoFinal = Math.floor(days) + " " + Math.floor(hours % 24) + ":" + Math.floor(minutes % 60)
    
    
    // se arma la data que se le pasara al servicio que conecta con el mapa
    const data = new MapCommand()
    data.accion = "ver online";
    data.params = {oFechaDesde: this.fDesde,
                    hDesde: this.horaDesde,
                    /* oFechaHasta: this.fHasta, */
                    idVehSeleccionado: this.vehicleCtrl.value.idvehiculo,
                    fechaPedida: resultadoFinal
                  }
                
    // pasamos los datos al servicio
    this.interactionMap.changeMessage(data)
    }
}

