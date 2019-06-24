import {Component, OnInit} from '@angular/core';
import {MapService} from '../services/map.service';
import * as mapboxgl from 'mapbox-gl';
import {LngLat} from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  map: mapboxgl.Map;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    this.buildMap();
  }

  private buildMap() {

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/93samolo/cjx64du6z0dvd1cs4ipkkqr8h',
      center: [2.5439412, 48.8941934],
      zoom: 10
    });

    this.map.on('load', () => {

      this.mapService.getMyLocation().subscribe(
        location => {
          this.map.flyTo({center: location, zoom: 13});
        }
      );

      this.mapService.getCourses()
        .subscribe(courses => {

            courses.forEach(course => {

              const el = document.createElement('div');
              el.style.backgroundImage = 'url("/assets/icon.svg")';
              el.style.width = '25px';
              el.style.height = '25px';

              // make a marker for each feature and add to the map
              new mapboxgl.Marker(el)
                .setLngLat(new LngLat(course.lng, course.lat))
                .addTo(this.map);
            });
          },
          onError => {
            console.log('on error: ' + onError);
          }
        );

      this.map.addSource('caca', {
        type: 'geojson',
        data: 'https://docs.mapbox.com/help/data/chicago-parks.geojson'
      });


    });

  }

}
