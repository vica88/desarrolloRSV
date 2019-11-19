import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { InteractionWithMapService } from '../../_services/interaction-with-map.service';
import { MapCommand } from '@app/_models/mapcommand';



@Component({
  selector: 'app-dialog-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class EventViewerComponent implements OnInit {
  
  @Input() data;
  @Input() options: {mostrarControles: boolean}

  displayedColumns: string[] = ['fecha','velocidad','evento'];
  selectedRowIndex: any;
  dataSource = []
  nuevoData = []
  mostrarBotones: boolean
  
  constructor(
    private interactionMap: InteractionWithMapService,
  ) { }
    
  pausarAnimacion(){
    const dataDePausa = new MapCommand()
    dataDePausa.accion = "pausar"
    this.interactionMap.changeMessage(dataDePausa)
  }

  reanudarAnimacion(){
    const dataDeStart = new MapCommand()
    dataDeStart.accion = "start"
    this.interactionMap.changeMessage(dataDeStart)
  }
  
  isGroup(index, item): boolean{
    return item.isGroupBy;
  }

  highlight(row: any){
    this.selectedRowIndex = row.posicion;
    /* console.log(this.selectedRowIndex); */
  }
  
  arrowUpEvent(row: object, pos: number){
    var nuevaPos = this.dataSource.find(e => e.posicion == pos -1) 
    if (nuevaPos != null){
      this.highlight(nuevaPos); 
    }
  }
  

  arrowDownEvent(row: object, pos: number){
    var nuevaPos = this.dataSource.find(e => e.posicion == pos +1)
    if (nuevaPos != null){
      this.highlight(nuevaPos);
    } 
  }

  ngOnInit() {
    
    this.mostrarBotones = this.options.mostrarControles
    console.log(this.mostrarBotones)
    let fechaAnterior = ''
    let i = 0
    this.data.puntos.forEach(e => {
      let fechaComparar = e.fyh.split(' ')[0]
      if (fechaAnterior !== fechaComparar){
        this.nuevoData.push({fechaParaAgrupar:fechaComparar,isGroupBy:true})
      }
   
      e.posicion = i
      this.nuevoData.push(e)
      fechaAnterior = fechaComparar
      i++
    });
    this.dataSource = this.nuevoData
  }

}
