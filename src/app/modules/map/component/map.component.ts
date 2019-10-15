import { Component, OnInit } from "@angular/core";
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import 'leaflet-routing-machine'
import 'leaflet-rotatedmarker'
import 'leaflet-sidebar-v2'
import 'leaflet.markercluster'


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
import { Observable, interval, timer } from "rxjs";
import { switchMap, startWith } from 'rxjs/operators';

import { TrackingService } from "@app/_services/tracking.service";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import { MultilayerFeature } from "@app/_models/multilayerfeature";
import { featurestyles } from "@app/_models/featurestyles";
import { Posicion } from "@app/_models";
import { MatExpansionPanelDefaultOptions } from '@angular/material';
import { DataVehicleComponent } from '../../data-vehicle/data-vehicle.component';




@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})


export class MapComponent implements OnInit {
  public map: OlMap;
  public source: OlXYZ;
  public layer: OlTileLayer;
  public view: OlView;
  public features = [];
  public vl: VectorLayer;
  public vs: VectorSource;
  public opended = false; 
  public markers : L.MarkerClusterGroup
  public generalData: Array<DataVehicleComponent>;

  constructor(public trackingService: TrackingService) {
    this.generalData = []
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

  ngOnInit(){ 
       
    // Se crea el mapa y se lo inicializa por default en "Argentina"
    const map = L.map('map').setView([-34, -59], 7);
    
    // Creamos la capa para que se conecte con la API de GoogleMaps
    L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      { 
        maxZoom: 20, 
        subdomains:['mt0','mt1','mt2','mt3'] 
      }
    ).addTo(map);

    // Se crea el cluster donde se agrupan los vehiculos
    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    }); 

    interval(10000).pipe(startWith(0),switchMap(() => this.trackingService.getPosiciones())).subscribe(data => {
      data.forEach(posicion => { 
        if (!(posicion.idvehiculo in this.generalData)){
          let numLong= parseFloat(posicion.longitud)
          let numLat = parseFloat(posicion.latitud)
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
              setLatLng([numLat,numLong])
              .setContent('<p>Patente: '+ posicion.idvehiculo + '<br>' + 
                              'Latitud: ' + posicion.latitud + '<br>' + 
                              'Longitud: ' + posicion.longitud +'<br>' + 
                              'Evento: ' + posicion.evento +'<br>' + 
                              'Tipo Vehiculo: ' + posicion.idtipovehiculo + '<br>' + 
                              'Fecha: ' + posicion.fechayhora + '<br>' +
                              'Angulo: ' + posicion.orientacion + '</p>')
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
              this.generalData[posicion.idvehiculo].arrowMarker.addTo(map);
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
          // Si el angulo es mayor o igual a 0
          if (posicion.orientacion >= 0){
      
            // Si la flecha fue dibujada entonces actualizar la posicion
            if (map.hasLayer(this.generalData[posicion.idvehiculo].arrowMarker)){
              this.generalData[posicion.idvehiculo].arrowMarker.setRotationAngle(posicion.orientacion)
              
            // Si no fue dibujada, agregarla al mapa y actualizarla
            }else{
           /*    autoVehiculo.arrowMarker.addTo(map); */
              this.generalData[posicion.idvehiculo].arrowMarker.addTo(map)
              this.generalData[posicion.idvehiculo].arrowMarker.setRotationAngle(posicion.orientacion)
            } 
          
          // si el angulo es menor a 0 y la flecha esta dibujada, entonces hay que eliminarla   
          }else{
            if (map.hasLayer(this.generalData[posicion.idvehiculo].arrowMarker)){
              this.generalData[posicion.idvehiculo].arrowMarker.removeFrom(map)
              /* autoVehiculo.arrowMarker.removeFrom(map) */
            }
          }
                       
         /*  var popup = L.popup({
            offset: [0,60],
            closeOnClick: false,
          }). */
          this.generalData[posicion.idvehiculo].vehicleMarker.getPopup().
            /* setLatLng([numLat,numLong]) */
            setContent('<p>Patente: '+ posicion.idvehiculo + '<br>' + 
                            'Latitud: ' + posicion.latitud + '<br>' + 
                            'Longitud: ' + posicion.longitud +'<br>' + 
                            'Evento: ' + posicion.evento +'<br>' + 
                            'Tipo Vehiculo: ' + posicion.idtipovehiculo + '<br>' + 
                            'Fecha: ' + posicion.fechayhora + '<br>' +
                            'Angulo: ' + posicion.orientacion + '</p>')
            
            /* this.generalData[posicion.idvehiculo].vehicleMarker.bindPopup(popup) */
        } 
        });
        /* markers.on('click', function(e) { 
          document.getElementById("log").innerHTML = "marker " + e.target.title;
        }); */ 
        /* console.log(this.markers) */
        this.markers.on("animationend", (e:any) =>{
        
          
        })
        map.addLayer(this.markers)
    })


    // Dibujamos las distintas figuras (auto = 1, petroleo = 3 y camion = 8, por ahora)
  /*   this.trackingService.getPosiciones().subscribe(data => {
      data.forEach(posicion => { 
        let numLong= parseFloat(posicion.longitud)
        let numLat = parseFloat(posicion.latitud)
        if (posicion.idtipovehiculo == 1){
          const Iauto = L.icon({
            iconUrl: 'assets/camioneta.png',
            iconSize: [48,48],
            iconAnchor: [24, 24],
            popupAnchor: [-3, -76],
          });
          L.marker([numLat,numLong],
          {icon: Iauto}).addTo(map);
          //fin vehiculo 
          const Iflecha = L.icon({
            iconUrl: 'assets/flecha.png', 
            iconSize: [70,70],
            iconAnchor: [35, 35],
            popupAnchor: [-3, -76], 
          }); 
          L.marker([numLat,numLong],{
            icon: Iflecha,
            rotationAngle: 270,
            rotationOrigin: 'center center',
            zIndexOffset: -1,    
          }).addTo(map) 
        }
        else if (posicion.idtipovehiculo == 3){
          const Iauto = L.icon({
            iconUrl: 'assets/oil.png',
            iconAnchor: [64, 64],
            popupAnchor: [-3, -76],
          });
        L.marker([numLat,numLong],
          {icon: Iauto}).addTo(map);        
        }
        else if (posicion.idtipovehiculo == 8){
          const Iauto = L.icon({
            iconUrl: 'assets/truck.png',
            iconAnchor: [64, 64],
            popupAnchor: [-3, -76],
          });
        L.marker([numLat,numLong], 
        {icon: Iauto}).addTo(map);       
        }else{ 
          console.log('es otra cosa')
        }
        });
    }); */
      /* add a new panel */
    
 /*    var panelContent = {
      id: 'userinfo',                     // UID, used to access the panel
      tab: '<i class="fa fa-gear"></i>',  // content can be passed as HTML string,
      pane: '<p>Test</p>',        // DOM elements can be passed, too
      title: 'Your Profile',              // an optional pane header
      position: 'bottom'                // optional vertical alignment, defaults to 'top'
    }; */

    /*const sidebar = L.control.sidebar({
      autopan: false,       // whether to maintain the centered map point when opening the sidebar
      closeButton: true,    // whether t add a close button to the panes
      container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
      position: 'left',     // left or right
    }).addTo(map);
    
    sidebar.addPanel({
      id: 'userinfo',                     // UID, used to access the panel
      tab: '<i class="fa fa-road active"></<i>',  // content can be passed as HTML string,
      pane: '<app-prueba></app-prueba>',         // DOM elements can be passed, too
      title: 'Seguridad Vial',              // an optional pane header
      position: 'top'                // optional vertical alignment, defaults to 't);
    }) */

  }
}
/* latitude: number = 18.5204;
  longitude: number = 73.8567; */

/* generarLayerVehiculos(datos) {
    let features = [];

    datos.forEach((v, i) => {
      // TODO Esto moverlo adentro del constructor de MultiLayerFeature
      let f = new MultilayerFeature(v);
      if (f.idtipovehiculo == 1) {
        f.main.setStyle(featurestyles.default['car']);
      } else if (i = 2) {
        f.main.setStyle(featurestyles.default['truck']);
      } else {
        f.main.setStyle(featurestyles.default['Point']);
      }

      features.push(f);
    });
  } */

/* ngOnInit(): void { */
//console.log('se ejecuta')
/*  this.source = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });

    this.layer = new OlTileLayer({
      source: this.source
    });
*/
/*  this.view = new OlView({
      center: [6.661594, 50.433237],
    });
 
    const googleLayer = new GoogleLayer();

    this.map = new OlMap({
      target: 'map',
      layers: [googleLayer],
      view: this.view
    }); 

    var olGM = new OLGoogleMaps({ map: this.map }); // map is the ol.Map instance
    olGM.activate(); 
     */
/* var test1: Observable<Posicion[]>;
    test1 = timer(0, 5000).pipe(
      concatMap(_ => this.trackingService.getPosiciones()),
      map((data) => {console.log("Adentro:"); console.log(data); return data;}),
    ); 

    var subscr = test1.subscribe(data => { console.log("Afuera:"); 
    console.log(data); 
    subscr.unsubscribe()}); */

// ver que pasa con esto -> concatMap???
/*   var test1: Observable<Posicion[]>;

    timer(0, 5000).pipe(
      concatMap(_ => this.trackingService.getPosiciones()).subscribe(data => {
      //console.log(data)  
      data.forEach(posicion => { 
        let numLong= parseFloat(posicion.longitud)
        let numLat = parseFloat(posicion.latitud)
        //console.log(numLong,numLat)
        const figura = new Feature({
          geometry: new Point(fromLonLat([numLong,numLat])), 
        });
        //console.log(figura.getGeometry().getExtent())

        if (posicion.idtipovehiculo == 1){
          figura.setStyle(this.styles['car'])       
        }
        else if (posicion.idtipovehiculo == 3){
          figura.setStyle(this.styles['truck'])       
        }
        else if (posicion.idtipovehiculo == 8){
          figura.setStyle(this.styles['pozo'])       
        }else{ 
          console.log('es otra cosa')
        }
        this.features.push(figura)
      })

      //creamos el source (fuente) y el layer (capa) para luego asignarsela
      //al mapa
      this.vs = new VectorSource({
        features: this.features
      })
      this.vl = new VectorLayer({
        source: this.vs
      })
      this.map.addLayer(this.vl)
      
      // Se crea un zona donde se dibujaron los puntos (se toman los mas alejados
      // para formar un rectangulo y es lo que se visualiza)
      let layerExtent = this.vl.getSource().getExtent();
      if (layerExtent) {
        this.map.getView().fit(layerExtent,{
          size:this.map.getSize(),
        });
    }
    }))
  }
} */
