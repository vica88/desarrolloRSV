import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './modules/map/component/map.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from './home';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatButtonModule, MatSidenavModule, MatMenuModule, MatFormFieldModule, MatSelectModule, 
        MatTableModule } from '@angular/material';
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { DialogRankingDiarioComponent } from './modules/dialog-ranking-diario/dialog-ranking-diario.component';
import { DataVehicleComponent } from './modules/data-vehicle/data-vehicle.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogDragDropComponent } from './modules/dialog-drag-drop/dialog-drag-drop.component';
import { PopupmarkerComponent } from './modules/popupmarker/popupmarker.component';
import { EventViewerComponent } from './modules/event-viewer/event-viewer.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { LocalstorageService } from './_services/localstorage.service';
import { DialogContentBuscarVehiculoComponent } from './modules/dialog-content-buscar-vehiculo/dialog-content-buscar-vehiculo.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    DialogRankingDiarioComponent,
    DataVehicleComponent,
    DialogDragDropComponent,
    PopupmarkerComponent,
    EventViewerComponent,
    DialogContentBuscarVehiculoComponent
  ],
  entryComponents: [DialogRankingDiarioComponent, DialogDragDropComponent, PopupmarkerComponent,
    EventViewerComponent, DialogContentBuscarVehiculoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    DragDropModule,
    NgxMaterialTimepickerModule,
    StorageServiceModule,
    MatTableModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },LocalstorageService,
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent], 
})
export class AppModule { }
