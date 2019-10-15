import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionWithMapService {
  
  private content = new Subject<any>()
  public share = this.content.asObservable();

  constructor() { }
}
