import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { DialogRankingDiarioComponent } from '../dialog-ranking-diario/dialog-ranking-diario.component';
import { AuthenticationService } from '@app/_services';
import { DialogDragDropComponent } from '../dialog-drag-drop/dialog-drag-drop.component';
import { Vehiculo } from '@app/_models/vehicles';
import { VehicleService} from '../../_services/vehicle.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit{
  public listaVehiculos: Array<Vehiculo>
  constructor(
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private vehiculosService: VehicleService,
    
    ) { 
      this.listaVehiculos = []
    }
  
  openDialog(){
    if(this.dialog.openDialogs.length==0){
      this.dialog.open(DialogRankingDiarioComponent,{ 
        disableClose: true, 
        hasBackdrop: false,
      }); 
    }
  }
  
  openDragArea(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.data = {
      lista: this.listaVehiculos 
    }
    if(this.dialog.openDialogs.length==0){
      this.dialog.open(DialogDragDropComponent, dialogConfig);
    }
  } 
  
  /* getListaVehiculos(){
    this.vehiculosService.getVehiculos().subscribe(data =>{
      data.forEach(vehiculo =>{
        this.listaVehiculos[vehiculo.id] = vehiculo
      })
    })
    console.log(this.listaVehiculos)
  } */

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
