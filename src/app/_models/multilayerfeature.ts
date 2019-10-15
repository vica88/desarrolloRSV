import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

export class MultilayerFeature {
    main: Feature;
    orientation: Feature;
    idv: number;
    idtipovehiculo: number;

    constructor(data: any) {
        this.idv = data['idvehiculo'];
        this.idtipovehiculo = data['idtipovehiculo'];

        this.main = new Feature({
            geometry: new Point(fromLonLat(data['coords'])),
            patente: data['patente'],
            idv: data['idvehiculo'],
            tipo: data['idtipovehiculo']
        });

        if (data['orientacion'] >= 0) {
            this.orientation = new Feature({
                geometry: new Point(fromLonLat(data['coords'])),
                patente: data['patente'],
                idv: data['idvehiculo'],
                tipo: data['idtipovehiculo']
            })
        }
    }
}