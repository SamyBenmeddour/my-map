import {Component, OnInit} from '@angular/core';
import {Status} from '../model/Status';
import {log} from 'util';
import {MapService} from '../services/map.service';
import {RemoteService} from '../services/remote.service';
import {promise} from 'selenium-webdriver';
import delayed = promise.delayed;
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-pannel',
  templateUrl: './pannel.component.html',
  styleUrls: ['./pannel.component.css']
})
export class PannelComponent implements OnInit {

  selectedOption: string = Status[Status.ASSIGNE];
  states = Object.keys(Status).filter(k => typeof Status[k as any] === 'number');
  zone: number;
  loading: boolean;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
  }

  search() {
    this.loading = true;
    this.mapService.fetchCourses(Status[this.selectedOption], this.zone)
      .pipe(
        delay(2000)
      )
      .subscribe(
        onNext => {
          this.loading = false;
        },
        onError => {
          log('On error ' + onError);
          this.loading = false;
        },
        () => {
          log('On complete');
          this.loading = false;
        }
      );
  }

}
