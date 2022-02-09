import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
// import 'heatmap.js';
import "leaflet.heat";
import { addressPoints } from '../../../assets/realworld.10000';

declare const HeatmapOverlay: any;

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnInit {
   private map: any;
   HeatmapOverlay: any
  ngOnInit(): void {
 
  }

  ngAfterViewInit(): void {
    this.initMap();
    
  }

   quakePoints = [
    [-41.5396,174.1242,1.7345],
    [-38.8725,175.9561,2.6901],
    [-41.8992,174.3117,4.6968],
    [-41.7495,174.02,1.8642],
    [-41.7008,174.0876,2.1629],
    [-41.7371,174.0682,2.0408],
    [-41.372,173.3502,2.7565],
    [-41.7511,174.0623,2.4531],
    [-41.7557,174.3391,2.1871],
    [-41.6881,174.2726,3.1336],
    [-41.7463,174.1194,2.7113],
    [-41.6966,174.1238,2.4168]
  ]

  private initMap(): void {
    // Initialising map with center point by using the coordinates
    // Setting initial zoom to 3
    this.map = L.map('map', {
      center: [ 23.2599, 77.4126],
      zoom: 11
    });

    // Initialising tiles to the map by using openstreetmap
    // Setting zoom levels
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // maxZoom: 18,
      // minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Adding tiles to the map
     tiles.addTo(this.map);

  
    let heat = L.heatLayer(
      [
        [23.2237, 77.4126,1.7345],
        [23.2675, 77.4236,2.6901],
        [23.1232, 77.4265,4.6968],
        [23.7658, 77.3126,1.8642],
        [23.3546, 77.1236,2.1629],
        [23.9754, 77.7896,2.0408],
        [23.3537, 77.0926,2.7565],
        [-41.7511,174.0623,2.4531],
        [-41.7557,174.3391,2.1871],
        [-41.6881,174.2726,3.1336],
        [-41.7463,174.1194,2.7113],
        [-41.6966,174.1238,2.4168]
      ] // lat, lng, intensity
    , { radius: 35,
      minOpacity: 1, 
      gradient: {0.3: 'blue', 0.8: 'lime', 1: 'red'}}).addTo(this.map);
  }
  

  //   onMapReady(map) {
  //     let newAddressPoints = addressPoints.map(function (p) { return [p[0], p[1]]; });
  //     var cfg = {
  //       "minOpacity": .3, 
  //       "scaleRadius": true,
  //       "useLocalExtrema": true,
  //     };


  //     const heat = L.heatLayer(newAddressPoints).addTo(map);
  // }

  // onMapReady(map) {
  //   let newAddressPoints = addressPoints.map(function (p) { return [p[0], p[1]]; });
  //   let heat = L.heatLayer([50.5, 30.5, 0.2], {
  //     radius : 25, // default value
  //     blur : 15, // default value
  //     gradient : {1: 'red'} // Values can be set for a scale of 0-1
  // }).addTo(this.map);

   
    




}
