import { Punto } from './punto';
import { MarcoRecorrido } from './marcorecorrido';
import { InfoRecorrido } from './inforecorrido';
import { TipoRecorrido } from './tiporecorrido';
export class ReporteOnlineResult{
    puntos: Punto[];
    marco: MarcoRecorrido;
    info: InfoRecorrido;
    tipo: TipoRecorrido;
}