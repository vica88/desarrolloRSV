import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogConfig, MatSidenav} from '@angular/material';
import { DialogRankingDiarioComponent } from '../dialog-ranking-diario/dialog-ranking-diario.component';
import { AuthenticationService } from '@app/_services';
import { DialogDragDropComponent } from '../dialog-drag-drop/dialog-drag-drop.component';
import { Vehiculo } from '@app/_models/vehicles';
import { VehicleService} from '../../_services/vehicle.service';
import { InteractionWithMapService } from '../../_services/interaction-with-map.service';
import { MapCommand } from '@app/_models/mapcommand';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit{

  @ViewChild("drawer",{static: false}) block: MatSidenav

  public listaVehiculos: Array<Vehiculo>
  constructor(
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private vehiculosService: VehicleService,
    private interactionMap: InteractionWithMapService,
    ) { 
      this.listaVehiculos = []
    }
  
  openDialog(){
    this.block.toggle()
    if(this.dialog.openDialogs.length==0){
      this.dialog.open(DialogRankingDiarioComponent,{ 
        disableClose: true, 
        hasBackdrop: true,
      }); 
    }
  }
  
  openDragArea(){
    this.block.toggle()
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = {
      lista: this.listaVehiculos 
    }
    if(this.dialog.openDialogs.length==0){
      this.dialog.open(DialogDragDropComponent, dialogConfig);
    }
  } 

  buscarVehiculo() {
    this.block.toggle()
    const dataDeBusquedaVehiculo = new MapCommand()
    dataDeBusquedaVehiculo.accion = "buscar vehiculo"
    this.interactionMap.changeMessage(dataDeBusquedaVehiculo)
  }

  salir(){
    this.authenticationService.logout()
  }
  
  ngOnInit(){
    this.vehiculosService.getVehiculos().subscribe(data =>{
      data.forEach(vehiculo =>{
        this.listaVehiculos.push(vehiculo)
      })
    })
  }
}
