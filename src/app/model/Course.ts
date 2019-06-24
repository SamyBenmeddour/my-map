import {Status} from './Status';
import {Address} from './Address';

export class Course {

  id: number;
  status: Status;
  zone: number;
  beginDate: number;
  endDate: number;
  address: Address;
  passenger: string;
  amount: string;
  lat: number;
  lng: number;

}
