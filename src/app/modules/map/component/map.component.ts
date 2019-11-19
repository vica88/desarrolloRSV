import { Component, OnInit, ComponentFactoryResolver, Injector, DoCheck, ComponentRef, OnDestroy } from "@angular/core";
import { MovingMarker } from '../../../../assets/js/MovingMarker.js'
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import 'leaflet-routing-machine'
import 'leaflet-rotatedmarker'
/* import 'leaflet-sidebar-v2' */
import 'leaflet.markercluster'
import '../../../_extensions/MovMarker' 
import '../../../_extensions/Dialog'
/* import 'leaflet.control.select' */
/* import 'leaflet-moving-marker' */

import GoogleLayer from "olgm/layer/Google.js";
//import { defaults } from 'olgm/interaction.js';
import OLGoogleMaps from "olgm/OLGoogleMaps.js";
//import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import "ol/ol.css";
import { Feature, Map, View } from "ol";
import { Point, LineString, Geometry } from "ol/geom";

import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { Vector as VectorSource, OSM } from "ol/source";

import { fromLonLat } from "ol/proj";
import OlMap from "ol/Map";
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from "ol/style";
import OlXYZ from "ol/source/XYZ";
import OlTileLayer from "ol/layer/Tile";
import OlView, { createCenterConstraint } from "ol/View";

//import XYZ from 'ol/source/XYZ';

import { concatMap } from "rxjs/internal/operators/concatMap";
import { map } from "rxjs/internal/operators/map";
import { Observable, interval, timer, BehaviorSubject } from "rxjs";
import { switchMap, startWith, withLatestFrom, filter } from 'rxjs/operators';

import { TrackingService } from "@app/_services/tracking.service";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import { MultilayerFeature } from "@app/_models/multilayerfeature";
import { featurestyles } from "@app/_models/featurestyles";
import { Posicion } from "@app/_models";
import { MatExpansionPanelDefaultOptions } from '@angular/material';
import { DataVehicleComponent } from '../../data-vehicle/data-vehicle.component';
import { InteractionWithMapService } from '@app/_services/interaction-with-map.service';
import { MapCommand } from '@app/_models/mapcommand';
import { PopupmarkerComponent } from '@app/modules/popupmarker/popupmarker.component';
import { ReporteOnlineResult } from '@app/_models/reporteonlineresult';
import { EventViewerComponent } from '../../event-viewer/event-viewer.component';
import { DialogContentBuscarVehiculoComponent } from '@app/modules/dialog-content-buscar-vehiculo/dialog-content-buscar-vehiculo.component';
import { Vehiculo } from '@app/_models/vehicles';
import { VehicleService } from '@app/_services/vehicle.service';


interface dialogContentMetaData{
  componentInstance: ComponentRef<EventViewerComponent>
}

interface dialogContentBuscarVehiculoMetaData{
  componentInstance: ComponentRef<DialogContentBuscarVehiculoComponent>
}


@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})


export class MapComponent implements OnInit, DoCheck, OnDestroy {
  public map: L.Map;
  public source: OlXYZ;
  public layer: OlTileLayer;
  public view: OlView;
  public features = [];
  public vl: VectorLayer;
  public vs: VectorSource;
  public opended = false; 
  public markers : L.MarkerClusterGroup
  public generalData: Array<DataVehicleComponent>;
  public message:string;
  public lineCoordinate = [];
  public pause = new BehaviorSubject<boolean>(false)
  public markerActual: any;
  public dinamicComponent: dialogContentMetaData[] = [];
  public dinamicComponent2: dialogContentBuscarVehiculoMetaData[] = [];
  public dialogBuscarVehiculos: any;
  public listaVehiculosMapa: Vehiculo[]

  constructor(
    public interactionMap: InteractionWithMapService,
    public trackingService: TrackingService,
    public vehiculosService: VehicleService,
    private resolver: ComponentFactoryResolver, 
    private injector: Injector
    ) {
    this.generalData = []
    this.listaVehiculosMapa = []
  }

  styles = {
    Point: new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: "blue"
        }),
        radius: 5,
        stroke: new Stroke({
          color: "yellow",
          width: 2
        })
      })
    }),
    LineString: new Style({
      stroke: new Stroke({
        color: "#f00",
        width: 3
      })
    }),
    MultiLineString: new Style({
      stroke: new Stroke({
        color: "#0f0",
        width: 3
      })
    }),
    truck: new Style({
      image: new Icon({
        anchor: [0.1, 20],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: "assets/truck.png",
        size: [64, 64],
        scale: 0.3
      })
    }),
    car: new Style({
      image: new Icon({
        anchor: [0.1, 20],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: "assets/car.png",
        size: [64, 64],
        scale: 0.2
      })
    }),
    pozo: new Style({
      image: new Icon({
        anchor: [0.1, 20],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: "assets/pozo.png",
        size: [64, 64],
        scale: 0.2
      })
    })
  };

  hacerAccion(data: MapCommand){
    if (data == null){
      return
    }
    if (data.accion == "ver online"){
      this.dibujarRecorrido(data.params.idVehSeleccionado,data.params.oFechaDesde,
                            data.params.fechaPedida,data.params.hDesde)
    }
    if (data.accion == "animar"){
      this.animar(data.params.idVehSeleccionado,data.params.oFechaDesde,
                            data.params.fechaPedida,data.params.hDesde)
    }
    if (data.accion == "pausar"){
      this.markerActual.pause()
    }
    if (data.accion == "start"){
      this.markerActual.start()
    }
    if (data.accion == "buscar vehiculo"){
      this.dibujarDialogBusquedaVehiculo()
    }
    if (data.accion == "vehiculos seleccionados"){
      this.mostrarVehiculosSeleccionados(data.params.idVehiculosSeleccionados)
    }
  }
  
  mostrarVehiculosSeleccionados(listaIdVehiculos: any){
    
    // buscamos en la lista de id que se pasan de los vehiculos si esta en la lista
    // de todos los vehiculos que tiene el mapa si lo encuentra lo agrega a la lista de seleccionados
    
    var listaVehiculosSeleccionados = []
    if (listaIdVehiculos.length > 0){
      listaIdVehiculos.forEach(id =>{
        if (id in this.generalData){
            listaVehiculosSeleccionados.push(this.generalData[id].vehicleMarker) 
        } 
      }) 
      
      // se crea un grupo con los markers seleccionados y se crea la zona 
      // (min long y max long y min latmax lat)
      if (listaVehiculosSeleccionados.length > 0){
        var group = L.featureGroup(listaVehiculosSeleccionados);
        this.map.fitBounds(group.getBounds()); 
      }
    }
  }

  dibujarDialogBusquedaVehiculo(){
    const factory = this.resolver.resolveComponentFactory(DialogContentBuscarVehiculoComponent);
    const component = factory.create(this.injector);
    component.instance.data = this.listaVehiculosMapa;
    component.changeDetectorRef.detectChanges();
    // associate the component element to the HTML part of the Popup
    const dialogContent = component.location.nativeElement;
    
    const LeafletDialog = L as any;
    if (this.dialogBuscarVehiculos == null){
    this.dialogBuscarVehiculos = LeafletDialog.control.dialog()
      .setContent(dialogContent).addTo(this.map);
    }else{
      this.dialogBuscarVehiculos.open()
    }
    this.dinamicComponent2.push({
        componentInstance: component
    });
    
  }

  //idVehiculo: number, fechaDesde: Date, horaHasta: string,horaDesde: string)
  dibujarRecorrido(idVehiculo: any, fechaDesde: any, horaHasta: any,horaDesde: any) {
    this.pause.next(true)
    this.trackingService.getRecorrido(idVehiculo,fechaDesde,horaHasta,horaDesde).subscribe(
      data => { 
        this.TrazarRecorrido(data,true); 

        // creamos el componente que seria el popup a asignar al marker
          // y le pasamos la data (los datos dentro del componente de posicion)

          this.dibujarDialog(data,false);
      }
    )
  } 

  private dibujarDialog(data: ReporteOnlineResult, muestraControles: boolean) {
    const factory = this.resolver.resolveComponentFactory(EventViewerComponent);
    const component = factory.create(this.injector);
    component.instance.data = data;
    component.instance.options = { mostrarControles: muestraControles }
    component.changeDetectorRef.detectChanges();
    // associate the component element to the HTML part of the Popup
    const dialogContent = component.location.nativeElement;
    
    const LeafletDialog = L as any;
    var dialog = LeafletDialog.control.dialog()
      .setContent(dialogContent)
      .addTo(this.map);

    this.dinamicComponent.push({
      componentInstance: component
    });
  }

  animar(idVehiculo: any, fechaDesde: any, horaHasta: any,horaDesde: any){
    this.pause.next(true)
    const duracion = []
    this.trackingService.getRecorrido(idVehiculo,fechaDesde,horaHasta,horaDesde).subscribe(
      data => { 
        this.TrazarRecorrido(data,false);
        for(let i=1; i < data.puntos.length; i++){
          if (data.puntos[i].idevento = 7){
            duracion.push(500)
          }else{
            let tiempoEntrePuntos = data.puntos[i].fechayhora.getTime() - 
            data.puntos[i-1].fechayhora.getTime()
            duracion.push(tiempoEntrePuntos)
          }
        }
        duracion.push(0)
        const Leaflet = L as any;
        this.markerActual =  Leaflet.movingMarker(data.puntos,
        duracion, {autostart: false});
        this.markerActual.addTo(this.map);
        this.dibujarDialog(data,true);
      } 
    )
  }

  private TrazarRecorrido(data: ReporteOnlineResult, dibujarFlechas: boolean) {
    data.puntos.forEach(punto => {

      // antes de comenzar a crear el marco y luego dibujar las flechas
      // debemos borrar los vehiculos y flechas ya dibujados previamente
      
      this.map.removeLayer(this.markers);
      
      // armamos el marco donde se zoomeara segun la zona de flechas
      var corner1 = L.latLng(data.marco.maxlat, data.marco.minlng), 
      corner2 = L.latLng(data.marco.minlat, data.marco.maxlng), 
      bounds = L.latLngBounds(corner1, corner2);
      this.map.fitBounds(bounds);
      
      var autoVehiculo = new DataVehicleComponent();

      if (dibujarFlechas){
        let iconoAusar = ''
        // por cada punto en el array de Puntos, dibujamos su correspondiente flecha
        if (punto.velocidad <= 43) {
            iconoAusar= 'assets/flechaVerde.png'        
        }
        else if ((punto.velocidad <= 82) || (punto.velocidad <= 112 &&
          autoVehiculo.idtipovehiculo < 3 || autoVehiculo.idtipovehiculo > 5)) {
            iconoAusar= 'assets/flechaAmarilla.png'
        }
        else {
          iconoAusar=  'assets/flechaRoja.png'
        }

        const Iflecha = L.icon({
          iconUrl: iconoAusar,
          iconSize: [15, 15],
          iconAnchor: [7.5, 7.5],
          popupAnchor: [-3, -76],
        });

        autoVehiculo.arrowMarker = L.marker([punto.latitud, punto.longitud], {
          icon: Iflecha,
          rotationAngle: punto.orientacion,
          rotationOrigin: 'center center',
          zIndexOffset: -1,
        }).bindTooltip(punto.fechayhora.toString() + " " +
          punto.velocidad.toString() + "-Km/h").addTo(this.map);
      }

      this.lineCoordinate.push([punto.latitud, punto.longitud]);
      
    })
    // se dibujan las lineas y se agregan al mapa
    L.polyline(this.lineCoordinate, { color: 'rgb(91,129,168)', opacity: 80 }).addTo(this.map);
  }
  
  

  ngOnInit(){ 
    
    // Obtenemos la lista de vehiculos que hay en el mapa

    this.vehiculosService.getVehiculos().subscribe(data =>{
      data.forEach(vehiculo =>{
        this.listaVehiculosMapa.push(vehiculo)
      })
    })

    // Se reciben los datos que ingreso el usuario en el dialog drag-drop
    // y que luego toca el boton "ver online" y se deberia dibujar el recorrido

    this.interactionMap.share$.subscribe(data => this.hacerAccion(data))

    // Se crea el mapa y se lo inicializa por default en "Argentina"
     this.map = L.map('map').setView([-34, -59], 7);
    
    // Creamos la capa para que se conecte con la API de GoogleMaps
    L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      { 
        maxZoom: 20, 
        subdomains:['mt0','mt1','mt2','mt3'] 
      }
    ).addTo(this.map);

    // Se agrega capa para YPF
    var capaYPF = L.tileLayer.wms("https://www.rsv.com.ar/cgi-bin/mapserv?MAP=%2Fhome%2Fubuntu%2Fsymfony%2Frsv%2Fweb%2Fjs%2Fopenlayers.map", {
      layers: 'ypfs',
      format: 'image/png',
      transparent: true,
      maxZoom: 20,
   })

   // Se agrega capa para los pozos
   var capaPozos = L.tileLayer.wms("https://www.rsv.com.ar/cgi-bin/mapserv?MAP=%2Fhome%2Fubuntu%2Fsymfony%2Frsv%2Fweb%2Fjs%2Fopenlayers.map", {
      layers: 'pozos',
      format: 'image/png',
      transparent: true,
      maxZoom: 20,
   })

   capaPozos.addTo(this.map);

   var overlayMaps = {
    "Estaciones YPF": capaYPF,
    "Pozos": capaPozos
   };

   L.control.layers(null,overlayMaps).addTo(this.map);

    // Se crea el cluster donde se agrupan los vehiculos
    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    }); 
  
    interval(10000).pipe(withLatestFrom(this.pause),filter(([v, paused]) => !paused),startWith(0),
    switchMap(() => this.trackingService.getPosiciones())).subscribe(data => {
      data.forEach(posicion => { 
        if (!(posicion.idvehiculo in this.generalData)){
          let numLong= parseFloat(posicion.longitud)
          let numLat = parseFloat(posicion.latitud)

          // creamos el componente que seria el popup a asignar al marker
          // y le pasamos la data (los datos dentro del componente de posicion)

          const factory = this.resolver.resolveComponentFactory(PopupmarkerComponent);
          const component = factory.create(this.injector);
          component.instance.data = posicion;
          component.changeDetectorRef.detectChanges();

          // associate the component element to the HTML part of the Popup
          const popupContent = component.location.nativeElement;

          /* if (posicion.idtipovehiculo == 1){ */
            const Iauto = L.icon({
              iconUrl: 'assets/camioneta.png',
              iconSize: [48,48],
              iconAnchor: [24, 24],
              popupAnchor: [-3, -76],
            });
            var autoVehiculo = new DataVehicleComponent();
            autoVehiculo.id = posicion.idvehiculo
            autoVehiculo.vehicleMarker = L.marker([numLat,numLong],
            {
              icon: Iauto, 
            })
            var popup = L.popup({
              offset: [0,60],
              closeOnClick: false,             
            }).
              setLatLng([numLat,numLong]).setContent(popupContent)  
              /* .setContent('<p><strong>Última recepción:</strong> '+ posicion.fechayhora + '<br>' + 
                              '<strong>Localización:</strong> ' + posicion.localizacion + '<br>' + 
                              '<strong>Punto cercano:</strong> ' + posicion.punto +'<br>' + 
                              '<strong>Último evento:</strong> ' + posicion.evento +'<br>' +'<br>'+
                              '<button (click)=mensaje()>PRUEBA</button>' +'</p>') */
              this.markers.addLayer(autoVehiculo.vehicleMarker)
              /* markers.addTo(map).bindPopup(popup) */                
              /* autoVehiculo.vehicleMarker.addTo(map).bindPopup(popup) */
              this.generalData[autoVehiculo.id] = autoVehiculo


              this.generalData[posicion.idvehiculo].vehicleMarker.bindPopup(popup)
          //fin vehiculo 

          const Iflecha = L.icon({
            iconUrl: 'assets/flecha.png', 
            iconSize: [70,70],
            iconAnchor: [35, 35],
            popupAnchor: [-3, -76], 
            });
            autoVehiculo.arrowMarker = L.marker([numLat,numLong],
            {
              icon: Iflecha,
              rotationAngle: posicion.orientacion,
              rotationOrigin: 'center center',
              zIndexOffset: -1,    
            })
            // Se fija si la orientacion es mayor o igual a 0, ya que sino quiere decir
            // que el vehiculo no esta en movimiento
            if (posicion.orientacion >= 0){
              this.generalData[posicion.idvehiculo].arrowMarker.addTo(this.map);
            }
          }
       /*    else if (posicion.idtipovehiculo == 100){
            const Iauto = L.icon({
              iconUrl: 'assets/oil.png',
              iconAnchor: [64, 64],
              popupAnchor: [-3, -76],
            });
          L.marker([numLat,numLong],
            {icon: Iauto}).addTo(map);        
          }
          else if (posicion.idtipovehiculo == 101){
            const Iauto = L.icon({
              iconUrl: 'assets/truck.png',
              iconAnchor: [64, 64],
              popupAnchor: [-3, -76],
            });
          L.marker([numLat,numLong], 
          {icon: Iauto}).addTo(map);  */      
        /*   }else{ 
            console.log('es otra cosa')
          }  */
        //falta una llave aca!!! --> {
          else{
          // Actualizar posicion
          let numLong= parseFloat(posicion.longitud)
          let numLat = parseFloat(posicion.latitud)
          this.generalData[posicion.idvehiculo].vehicleMarker.setLatLng([numLat,numLong])
          this.generalData[posicion.idvehiculo].arrowMarker.setLatLng([numLat,numLong])

          // creamos el componente que seria el popup a asignar al marker
          // y le pasamos la data (los datos dentro del componente de posicion)

          const factory = this.resolver.resolveComponentFactory(PopupmarkerComponent);
          const component = factory.create(this.injector);
          component.instance.data = posicion;
          component.changeDetectorRef.detectChanges();

          // associate the component element to the HTML part of the Popup
          const popupContent = component.location.nativeElement;

          // Si el angulo es mayor o igual a 0
          if (posicion.orientacion >= 0){
      
            // Si la flecha fue dibujada entonces actualizar la posicion
            if (this.map.hasLayer(this.generalData[posicion.idvehiculo].arrowMarker)){
              this.generalData[posicion.idvehiculo].arrowMarker.setRotationAngle(posicion.orientacion)
              
            // Si no fue dibujada, agregarla al mapa y actualizarla
            }else{
           /*    autoVehiculo.arrowMarker.addTo(map); */
              this.generalData[posicion.idvehiculo].arrowMarker.addTo(this.map)
              this.generalData[posicion.idvehiculo].arrowMarker.setRotationAngle(posicion.orientacion)
            } 
          
          // si el angulo es menor a 0 y la flecha esta dibujada, entonces hay que eliminarla   
          }else{
            if (this.map.hasLayer(this.generalData[posicion.idvehiculo].arrowMarker)){
              this.generalData[posicion.idvehiculo].arrowMarker.removeFrom(this.map)
              /* autoVehiculo.arrowMarker.removeFrom(map) */
            }
          }
                       
         
          this.generalData[posicion.idvehiculo].vehicleMarker.getPopup().setContent(popupContent)
        } 
      });
        
        this.markers.on("animationend", (e:any) =>{
        

        })
        this.map.addLayer(this.markers)
    })
  }

  ngDoCheck() {
    this.dinamicComponent.forEach(entry => {
      entry.componentInstance.changeDetectorRef.detectChanges();
    })

    this.dinamicComponent2.forEach(entry => {
      entry.componentInstance.changeDetectorRef.detectChanges();
    })
  }

  ngOnDestroy(){
    //Aca se tendria q destruir el componente q tiene el contenido del dialog de los eventos
    // tanto de animar como de ver online
  }
}
