import {Component, OnInit} from '@angular/core';
import {MapService} from '../services/map.service';
import * as mapboxgl from 'mapbox-gl';
import {GeoJSONSource, LngLat} from 'mapbox-gl';
import {GeoJSON, GeoJsonObject, Point, FeatureCollection, Geometry, Feature, GeoJsonProperties} from 'geojson';
import {Course} from '../model/Course';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  map: mapboxgl.Map;
  data: FeatureCollection<Geometry>;

  constructor(private mapService: MapService) {
    this.data = {
      type: 'FeatureCollection',
      features: new Array<Feature<Point>>()
    };
  }

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    this.buildMap();
  }

  private convertToFeature(course: Course): Feature<Point> {
    const geo: Geometry = {
      type: 'Point',
      coordinates: [course.lng, course.lat]
    };

    return  {
      type: 'Feature',
      geometry: geo,
      properties: {title: course.id, Icon: 'monument'}
    };
  }

  private buildMap() {

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/93samolo/cjx64du6z0dvd1cs4ipkkqr8h',
      center: [2.5439412, 48.8941934],
      zoom: 10
    });

    this.map.on('load', () => {

      this.map.addSource('courses', { type: 'geojson', data: this.data});

      this.mapService.getCourses().subscribe(
        next => {
          next.forEach( item => {
            const geo = this.convertToFeature(item);
            this.data.features.push(geo);
          });
          (this.map.getSource('courses') as GeoJSONSource).setData(this.data);
        }
      );

      this.mapService.getMyLocation().subscribe(
        location => {
          this.map.flyTo({center: location, zoom: 13});
        }
      );


      this.map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'courses',
        layout: {
          'icon-image': '{icon}-15',
          'text-field': '{title}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top'
        }
      });


      const test = this.map.getSource('courses');
      console.log('Test: ' + test);
      console.log(test.type);

    });

  }

}
