import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private messageSource = new BehaviorSubject('default message');
  receiveId = this.messageSource.asObservable();

  sendId(message: string) {
    this.messageSource.next(message)
  }

  private locationData = new BehaviorSubject({});
  receiveLocationData = this.locationData.asObservable();

  sendLocationData(message: {}) {
    this.locationData.next(message)
  }

  private heatData = new BehaviorSubject([]);
  receiveHeatData = this.heatData.asObservable();

  sendHeatData(message: []) {
    this.heatData.next(message)
  }

  private heatmapData = new BehaviorSubject({});
  receiveHeatmapData = this.heatmapData.asObservable();

  sendHeatmapData(message: {}) {
    this.heatmapData.next(message)
  }


}
