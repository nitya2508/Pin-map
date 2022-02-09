import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { DataService } from 'src/app/services/datsservice/data.service';
import { LocationService } from 'src/app/services/locationservice/location.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-view-edit-map',
  templateUrl: './view-edit-map.component.html',
  styleUrls: ['./view-edit-map.component.scss']
})
export class ViewEditMapComponent implements OnInit {
  private map: any;
  locationData: any;
  latlng: any;
  address: any;
  title: any;
  userLocArray: any;
  locationHistoryList: any;
  isLocationIDfound: any;
  locHistoryArray: any;

  constructor(private dataService: DataService, private http: HttpClient, public dialog: MatDialog,
    private locationservice: LocationService, private route: Router) { }

  ngOnInit(): void {
    this.dataService.receiveLocationData.subscribe((result) => {
      console.log("received loc data ===", result);
      this.locationData = result;
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getLocation();
    this.getLocationHistory();
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
    this.markerDisp(this.locationData.location)
  }

  getLocation() { //to pin a location on the map and get address 
    this.map.on("click", e => {
      console.log(e.latlng); // get the coordinates
      this.latlng = e.latlng
      this.openDialog()
      this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`).subscribe((req: any) => {
        console.log("address", req.display_name);
        this.address = req.display_name;
      })
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: "",
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed',result);
      this.title = result;

      if (this.title == null || this.title == 'undefined') {
        return;
      } else {
        this.addDatatoDB();
      }
    });
  }

  addDatatoDB() {
    console.log("add data to db");
    this.userLocArray = this.locationData.arrayList
    console.log("userLocArray", this.userLocArray);
    console.log(this.userLocArray[this.locationData.index].title = this.title);
    console.log(this.userLocArray[this.locationData.index].latitude = this.latlng.lat);
    console.log(this.userLocArray[this.locationData.index].longitude = this.latlng.lng);
    console.log(this.userLocArray[this.locationData.index].address = this.address);
    console.log(this.userLocArray[this.locationData.index].locationid);
    let data = {
      [this.locationData.userId]: this.userLocArray,
      id: this.locationData.id
    }
    console.log("data", data);

    this.locationservice.updateLocation(data).subscribe((response) => {
      console.log(response);
      this.locationHistory(this.userLocArray[this.locationData.index].locationid)
      this.route.navigateByUrl('/dashboard/table')
    })

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

    const lat = data.latitude;
    const lon = data.longitude;
    const marker = L.marker([lat, lon], { icon: myIcon });

    marker.addTo(this.map);
  }

  getLocationHistory() {
    this.locationservice.getLocationHistoryList().subscribe((response) => {
      console.log("location history", response);
      this.locationHistoryList = response;
    })
  }

  locationHistory(locID) {
    console.log("location detalis", locID);

    var now = new Date();
    var currentDate = [
      now.getFullYear(),
      '-',
      now.getMonth() + 1,
      '-',
      now.getDate(),
      ' ',
      now.getHours(),
      ':',
      now.getMinutes(),
      ':',
      now.getSeconds()
    ].join('');
    console.log("date", currentDate);

    let data = {

      action: "edited",
      time: currentDate

    }

    var keys = Object.keys(this.locationHistoryList);
    console.log("keys", keys);

    for (var i = 0; i < this.locationHistoryList.length; i++) {

      // console.log('match: ', this.locationArray[i])
      var keys = Object.keys(this.locationHistoryList[i]);
      console.log("keys", keys);

      if (keys[0] == this.locationData.userId) {
        this.isLocationIDfound = true;
        console.log(keys[0], "matched", this.locationData.userId);
        console.log(this.locationHistoryList[i][this.locationData.userId]);
        this.locHistoryArray = this.locationHistoryList[i][this.locationData.userId]
        console.log(this.locHistoryArray);

        for (var k = 0; k < this.locHistoryArray.length; k++) {
          var locArrayKeys = Object.keys(this.locHistoryArray[k]);
          console.log("loc array keys", this.locHistoryArray[k].locationId);
          // if (this.locHistoryArray[k].locationId == locID)
          if (this.locHistoryArray[k].locationId == locID) {
            console.log(this.locHistoryArray[k].locationId, "loc id matched", locID);
            this.locHistoryArray[k].trackLocationHistory.push(data)
            console.log(this.locHistoryArray[k].trackLocationHistory);
            this.locationHistoryList[i] = {
              [this.locationData.userId]: this.locationHistoryList[i][this.locationData.userId],
              id: this.locationHistoryList[i].id
            };
            console.log("sending data", this.locationHistoryList[i]);
            this.locationservice.updateLocationHistory(this.locationHistoryList[i]).subscribe((response) => {
              console.log(response);

            })

          } else {
            console.log(this.locHistoryArray[k].locationId, "loc id not matched", locID);
          }

        }



      }

    }





  }

}
