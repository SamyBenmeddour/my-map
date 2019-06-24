import {Component, OnInit} from '@angular/core';
import {Status} from '../model/Status';
import {log} from 'util';
import {MapService} from '../services/map.service';
import {RemoteService} from '../services/remote.service';

@Component({
  selector: 'app-pannel',
  templateUrl: './pannel.component.html',
  styleUrls: ['./pannel.component.css']
})
export class PannelComponent implements OnInit {

  selectedOption: string = Status[Status.ASSIGNE];
  states = Object.keys(Status).filter(k => typeof Status[k as any] === 'number'); // ["A", "B"]
  zone: number;
  loading: boolean;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.states.forEach(item => {
      log('Item trouvé: ' + item);
    });
  }

  stateSelected() {
    log('Nouvelle click: ' + this.selectedOption);
  }

  search() {
    this.loading = true;
    this.mapService.fetchCourses(Status[this.selectedOption], this.zone)
      .subscribe(
        onNext => {
          this.loading = false;
        },
        onError => {
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }

}
