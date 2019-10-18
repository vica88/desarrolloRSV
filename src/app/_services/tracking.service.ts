import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Posicion } from '@app/_models';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { ReporteOnlineResult } from '@app/_models/reporteonlineresult';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  
  public url: string;

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // HttpClient API get() method => Fetch employees list
  getPosiciones(): Observable<Posicion[]> {
    console.log("PASA POR POSICIONES y deberia invocar:" + `${environment.legacyApiUrl}/rsv/posiciones`);
    return this.http.get<Posicion[]>(`${environment.legacyApiUrl}/rsv/posiciones`, {})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }
  //dev.rsv.com.ar/rsv/reporteOnline?auto=21124&desde=2019-10-10&hasta=2%2000:00&hora=02:00  
  getRecorrido(idVehiculo,fechaDesde,horaHasta,horaDesde): Observable<ReporteOnlineResult> {
    console.log("PASA POR POSICIONES y deberia invocar:" + `${environment.legacyApiUrl}/rsv/misvehiculos`);
    return this.http.get<ReporteOnlineResult>(this.url + 
      '/reporteOnline?auto='+idVehiculo+'&desde='+fechaDesde+'&hasta='+horaHasta+'&hora='+horaDesde,{})
      .pipe(
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
