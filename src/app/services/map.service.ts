import {Injectable} from '@angular/core';
import {Course} from '../model/Course';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {BehaviorSubject, Observable} from 'rxjs';
import {RemoteService} from './remote.service';
import {Status} from '../model/Status';
import {map, tap} from 'rxjs/operators';
import {log} from 'util';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private courses: BehaviorSubject<Course[]> = new BehaviorSubject([]);

  constructor(private remoteService: RemoteService) {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.mapbox.accessToken);
  }

  getCourses(): Observable<Course[]> {
    return this.courses.asObservable();
  }

  fetchCourses(status?: Status, zone?: number): Observable<void> {
    log('Fetch courses: ' + status + ' '  + zone);
    return this.remoteService.fetchCourses(status, zone)
      .pipe (
        tap ( items => this.courses.next(items)),
        map ( () => void 0)
      );
  }

  getMyLocation(): Observable<mapboxgl.LngLat> {
    return new Observable( ( observer ) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
          observer.next(new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude));
          observer.complete();
        });
      } else {
        observer.error( new Error('User refused to give his position'));
      }
    });
  }

}
