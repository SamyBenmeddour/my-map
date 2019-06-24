import {ApiCourse} from '../model/ApiCourse';

export class SearchCourseResponse {

  status: string;
  errorCode: string[];
  moreResults: boolean;
  courses: ApiCourse[];

}
