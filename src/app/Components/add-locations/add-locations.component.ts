import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/datsservice/data.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-locations',
  templateUrl: './add-locations.component.html',
  styleUrls: ['./add-locations.component.scss']
})
export class AddLocationsComponent implements OnInit {
  private map:any;
  latlng: any;
  address: any;

  constructor(private dataservice:DataService, private http:HttpClient) { }

  ngOnInit(): void {

    this.dataservice.receiveHeatmapData.subscribe((result: any) => {
      console.log("received heat data", result);
      
    })
    
  
   // this.heatmapChoosed( this.heatmap_user);

  }
  ngAfterViewInit(): void {
    // if (this.map != undefined) {
      // this.map.remove();
      this.initMap();
      this.getLocation();
      // }
   
    // this.getLocationHistory();
  }


  centroid: L.LatLngExpression = [23.2599, 77.4126];

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

  getLocation() { //to pin a location on the map and get address 
    this.map.on("click", e => {
      console.log(e.latlng); // get the coordinates
      this.latlng = e.latlng
      this.markerDisp(this.latlng)
     
      this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`).subscribe((req: any) => {
        console.log("address", req.display_name);
        this.address = req.display_name;
      })
    });
  }

  markerDisp(data) {
    console.log("marker loc data ===", data);
    var myIcon = L.icon({
      iconUrl: 'assets/pin.png',
      iconRetinaUrl: 'assets/pin.png',
      iconSize: [25, 24],
      iconAnchor: [9, 21],
      popupAnchor: [0, -14]
    });

    const lat = data.lat;
    const lon = data.lng;
    const marker = L.marker([lat, lon], { icon: myIcon });

    marker.addTo(this.map);
  }

}
