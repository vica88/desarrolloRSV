import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ReportingService{
    
    public url: string;

    constructor(
        private _http: HttpClient
    ){
        this.url = environment.legacyApiUrl /* -->'http://dev.rsv.com.ar' */
    }    
    /* '/rankingOnline/rankingDiarioDescargar?desde=2019-08-26&hasta=2019-09-23&idusuario=0', { responseType: 'blob', observe: 'response' }). */
    getReport(fDesde,fHasta):Observable<HttpResponse<Blob>>{
        return this._http.get(this.url + 
            '/rankingOnline/rankingDiarioDescargar?desde='+fDesde+'&hasta='+fHasta+'&idusuario=0', { responseType: 'blob', observe: 'response' }).
            pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // Error handling 
    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
  }

}