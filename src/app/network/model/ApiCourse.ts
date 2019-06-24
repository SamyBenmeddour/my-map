import {Course} from '../../model/Course';
import {Status} from '../../model/Status';
import {ApiAddress} from './ApiAddress';

export class ApiCourse {

  courseNum: number;
  status: string;
  dateTime: number;
  endDateTime: number;
  vehicule: number;
  clientType: string;
  montant: string;
  adresse: ApiAddress;
  zone: number;
  passager: string;

  public static toCourse(apiCourse: ApiCourse): Course {
    const course = new Course();
    course.id = apiCourse.courseNum;
    course.status = Status[apiCourse.status];
    course.address = ApiAddress.toAddress(apiCourse.adresse);
    course.zone = apiCourse.zone;
    course.amount = apiCourse.montant;
    course.beginDate = apiCourse.dateTime;
    course.endDate = apiCourse.endDateTime;
    course.passenger = apiCourse.passager;
    return course;
  }
}
