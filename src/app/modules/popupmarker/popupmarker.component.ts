import { Component, OnInit, Input } from '@angular/core';
import { InteractionWithMapService } from '../../_services/interaction-with-map.service';
import { MapCommand } from '@app/_models/mapcommand';

@Component({
  selector: 'app-popupmarker',
  templateUrl: './popupmarker.component.html',
  styleUrls: ['./popupmarker.component.css']
})
export class PopupmarkerComponent implements OnInit {
  
  @Input() data;

  constructor(
    private interactionMap: InteractionWithMapService,
  ) { }
  
  ultimaHora(){
    const fechaActual = new Date()
    console.log(fechaActual)
    const datos = new MapCommand()
    const fechaDesde = fechaActual.getFullYear() + '-' + 
    (fechaActual.getMonth()+1).toString() + '-' + 
    fechaActual.getDate().toString();

    const fechaAnterior = new Date ((new Date()).getTime() - 3600000) 

    let resultadoFinal = fechaAnterior.getHours() + ":" + fechaAnterior.getMinutes()
   
    datos.accion = "ver online";
    datos.params = {oFechaDesde: fechaDesde,
                    hDesde: resultadoFinal,
                    idVehSeleccionado: this.data.idvehiculo,
                    fechaPedida: "0 1:00"
                  }
                  console.log(datos)
    this.interactionMap.changeMessage(datos)
  }

  ngOnInit() {
  }

}
