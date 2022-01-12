import { HttpClient } from '@angular/common/http';
import { createInjectableDefinitionMap } from '@angular/compiler/src/render3/partial/injectable';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit , AfterViewInit{
  private map:any;
  myLocation:any;
  latlng:any;
  title:any;
  address:any;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
//     var map = L.map('map').setView([51.505, -0.09], 13);


  }

ngAfterViewInit(): void{
  this.initMap();
  this.getLocation();
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
 
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: "",
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed',result);
      this.title=result;
      this.addMarker()
    });
  }


  getLocation(){
    this.map.on("click", e => {
      console.log(e.latlng); // get the coordinates
      this.latlng= e.latlng
      this.openDialog()


       this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`).subscribe((req: any) => {
      console.log("address", req.display_name);
      this.address=req.display_name;
    })
    
    
     });
  }

  addMarker(){
   

    let addressData = {
      title: this.title,
      latitude: this.latlng.lat,
      longitude: this.latlng.lng,
      address: this.address
    }
    console.log("addressData", addressData);
    

    
    var myIcon = L.icon({
      iconUrl: 'assets/pin.png',
      iconRetinaUrl: 'assets/pin.png',
      iconSize: [25, 24],
      iconAnchor: [9, 21],
      popupAnchor: [0, -14]
    });

    const lat = this.latlng.lat;
    const lon = this.latlng.lng;
    const marker = L.marker([lat, lon], { icon: myIcon });

    marker.addTo(this.map);
  }



}
