import CircleStyle from 'ol/style/Circle';
import { Style, Fill, Stroke, Icon } from 'ol/style';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';

export const featurestyles = {
    default:  {
        'Point': new Style({
          image: new CircleStyle({
            fill: new Fill({
              color: 'blue'
            }),
            radius: 5,
            stroke: new Stroke({
              color: 'yellow',
              width: 2
            })
          })
        }),
        'LineString': new Style({
          stroke: new Stroke({
            color: '#f00',
            width: 3
          })
        }),
        'MultiLineString': new Style({
          stroke: new Stroke({
            color: '#0f0',
            width: 3
          })
        }),
        'truck': new Style({
          image: new Icon(({
            anchor: [0.1, 20],
            anchorXUnits: IconAnchorUnits.FRACTION,
            anchorYUnits: IconAnchorUnits.PIXELS,
            src: 'assets/truck.png',
            size: [64, 64],
            scale: 0.5
          }))
        }),
        'car': new Style({
          image: new Icon(({
            anchor: [0.1, 20],
            anchorXUnits: IconAnchorUnits.FRACTION,
            anchorYUnits: IconAnchorUnits.PIXELS,
            src: 'assets/car.png',
            size: [64, 64],
            scale: 0.8
          }))
        }),
        'pozo': new Style({
          image: new Icon(({
            anchor: [0.1, 20],
            anchorXUnits: IconAnchorUnits.FRACTION,
            anchorYUnits: IconAnchorUnits.PIXELS,
            src: 'assets/pozo.png',
            size: [64, 64],
            scale: 0.7
          }))
        })
      }
  };