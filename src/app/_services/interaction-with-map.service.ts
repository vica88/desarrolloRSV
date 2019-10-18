import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { MapCommand } from '../_models/mapcommand';

@Injectable({
  providedIn: 'root'
})
export class InteractionWithMapService {
  
  private content = new BehaviorSubject<MapCommand>(null)
  public share$ = this.content.asObservable();

  constructor() { }

  changeMessage(data: MapCommand) { //hay que pasarle MapCommand en vez de any???
    this.content.next(data)
  }
}
