import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { MapCommand } from '@app/_models/mapcommand';

// key that is used to access the data in local storage
const STORAGE_KEY = 'rsv_';

@Injectable()
export class LocalstorageService {

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) { }

  public storeOnLocalStorage(key: String, taskTitle: any): void {
   
    // insert updated array to local storage
    this.storage.set(STORAGE_KEY + key, taskTitle);
    /* console.log(this.storage.get(STORAGE_KEY + key) || 'LocaL storage is empty'); */
  }

  public obtenerDatos(key){
    return (this.storage.get(STORAGE_KEY + key))
  }

  public eliminarDatos(key){
    this.storage.remove(STORAGE_KEY + key)
  }
}
