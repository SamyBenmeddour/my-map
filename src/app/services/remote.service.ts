import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Course} from '../model/Course';
import {SearchCourseResponse} from '../network/Responses/SearchCourseResponse';
import {Status} from '../model/Status';
import {flatMap, map, mapTo, mergeAll, mergeMap, pluck, tap, toArray} from 'rxjs/operators';
import {ApiCourse} from '../network/model/ApiCourse';

@Injectable({
  providedIn: 'root'
})

export class RemoteService {

  baseUrl = 'http://tpk-preprod-ix5:8890/interface1/';


  constructor(private http: HttpClient) { }

  fetchCourses(status?: Status, zone?: number): Observable<Course[]> {

    const parameters: any = {};
    parameters.searchDateTime = Date.now();
    if (status !== undefined) {
      parameters.status = Status[status];
    }
    if (zone !== undefined) {
      parameters.zone = zone;
    }

    const path = this.baseUrl + 'searchCourse';
    const body = JSON.stringify(parameters);

    return this.http.post<SearchCourseResponse>(path, body)
      .pipe(
        map ( response => {
          if (response.status === 'OK' && response.courses === undefined) {
            response.courses = [];
          }
          return response;
        } ),
        map(response => response.courses),
        map(courses => courses.map(course => ApiCourse.toCourse(course))),
        mergeAll(),
        mergeMap(item => this.getLatLng(item)),
        toArray()
      );
  }

  getLatLng(course: Course): Observable<Course> {
    const geoCodingUrl = 'https://api-adresse.data.gouv.fr/search/?q=';
    const address = `${course.address.number}+${course.address.name}+${course.address.city}`;

    const path = `${geoCodingUrl}${address}&limit=1&autocomplete=0`;
    return this.http.get(path)
      .pipe(
        pluck('features'),
        map(features => features[0]),
        pluck('geometry', 'coordinates'),
        map(coordinates => {
            course.lat = coordinates[1];
            course.lng = coordinates[0];
            return course;
          }
        )
      );
  }

}
