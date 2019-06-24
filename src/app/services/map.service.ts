import {Injectable} from '@angular/core';
import {Course} from '../model/Course';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {BehaviorSubject, Observable} from 'rxjs';
import {RemoteService} from './remote.service';
import {Status} from '../model/Status';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private courses: BehaviorSubject<Course[]> = new BehaviorSubject([]);

  constructor(private remoteService: RemoteService) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  getCourses(): Observable<Course[]> {
    return this.courses.asObservable();
  }

  fetchCourses(statusN?: Status, zone?: number): Observable<void> {
    return this.remoteService.fetchCourses()
      .pipe (
        tap ( items => this.courses.next(items)),
        map ( () => void 0)
      );
  }

  getMyLocation(): Observable<mapboxgl.lngLat> {
    return new Observable( ( observer ) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
          observer.next([position.coords.longitude, position.coords.latitude]);
          observer.complete();
        });
      } else {
        observer.error( new Error('User refused to give his position'));
      }
    });
  }

}
