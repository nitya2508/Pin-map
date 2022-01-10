import { createInjectableDefinitionMap } from '@angular/compiler/src/render3/partial/injectable';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit , AfterViewInit{
  private map:any;

  constructor() { }

  ngOnInit(): void {
//     var map = L.map('map').setView([51.505, -0.09], 13);


  }

ngAfterViewInit(): void{
  this.initMap()
}

   centroid: L.LatLngExpression=[12.972442, 77.580643];


  initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 5
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }




}
