import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-vehicle',
  templateUrl: './data-vehicle.component.html',
  styleUrls: ['./data-vehicle.component.css']
})
export class DataVehicleComponent implements OnInit {
  
  public vehicleMarker: L.Marker;
  public arrowMarker: L.Marker;
  public id: number;
  public evento: string;
  public idevento: number;
  public marca: string;
  public patente: string;
  public fechayhora: Date;
  public idvehiculo: number;
  public idtipovehiculo: number;

  constructor() {}

  ngOnInit() {
  }

}
