import { Component, OnInit } from '@angular/core';
import { ReportingService } from '../../_services/reporting.service';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-dialog-ranking-diario',
  templateUrl: './dialog-ranking-diario.component.html',
  styleUrls: ['./dialog-ranking-diario.component.css'],
  providers: [ReportingService]
})
export class DialogRankingDiarioComponent implements OnInit {
  
  public fechaDesde: Date;
  public fechaHasta: Date;
  public fDesde: string;
  public fHasta: string;
  constructor(
    private _reportingService: ReportingService
  ){}
    
  obtenerReporte(){
    
    //se hace el bindeo de las fechas que se ingresan en el calendario

    this.fDesde = this.fechaDesde.getFullYear().toString() + '-' + 
    (this.fechaDesde.getMonth()+1).toString() + '-' + 
    this.fechaDesde.getDate().toString();

    this.fHasta = this.fechaHasta.getFullYear().toString() + '-' + 
    (this.fechaHasta.getMonth()+1).toString() + '-' + 
    this.fechaHasta.getDate().toString();

    this._reportingService.getReport(this.fDesde,this.fHasta).subscribe(
      response => {
        /* switch (response.type) {
          case HttpEventType.DownloadProgress:
            this.downloadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100)});
            break;
          case HttpEventType.Response:
            this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE}); */
            const downloadedFile = new Blob([response.body], { type: response.body.type });
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            /* a.download = this.fileName; */
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
        //}
      },
      error => {
        console.log(error);
      }
    ) 
  }

  ngOnInit() {
    
  }

}
