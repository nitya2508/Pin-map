import { HttpClient } from '@angular/common/http';
import { createInjectableDefinitionMap } from '@angular/compiler/src/render3/partial/injectable';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from 'src/app/services/datsservice/data.service';
import { LocationService } from 'src/app/services/locationservice/location.service';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any;
  myLocation: any;
  latlng: any;
  title: any;
  address: any;
  userId: any;
  locationData: any;
  locationArray: any;
  locData: any;
  locationList: any;
  index: any;
  isUserIDfound = false;
  createData: any;
  locationHistoryList: any;
  isLocationIDfound = false;
  locid: any


  constructor(private http: HttpClient, public dialog: MatDialog, private dataservice: DataService, private locationservice: LocationService) { }

  ngOnInit(): void {


    this.dataservice.receiveId.subscribe((result: any) => {
      console.log("received Id", result);
      this.userId = result;

    })
    this.getLocationDetails();
    this.getLocationHistory();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getLocation();


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

  openDialog(): void { //to open a dialog box on the map
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
        this.addMarker();
      }
    });
  }

  getLocationDetails() { //get the list of locations choose by the user
    this.locationservice.getLocationList().subscribe((result: any) => {
      console.log("location list", result);
      this.locationArray = result;
      var keys = Object.keys(this.locationArray);
      console.log("keys======", keys);

      for (var i = 0; i < this.locationArray.length; i++) {

        console.log('match: ', this.locationArray[i])
        var keys = Object.keys(this.locationArray[i]);
        console.log("keys", keys);

        if (keys[0] == this.userId) {
          console.log("key found", keys[0], keys[1]);
          console.log('before: ', this.locationArray[i][this.userId]);
          this.locationList = this.locationArray[i][this.userId];

          for (var j = 0; j < this.locationList.length; j++) {
            // console.log("inside for loooop",this.locationList[j].latitude, this.locationList[j].longitude);
            let latLongData = {
              lat: this.locationList[j].latitude,
              lng: this.locationList[j].longitude
            }

            this.markerDisp(latLongData)

          }
          return

        } else {
          console.log("key not found", keys[0], this.userId);

        }
      }
    })
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

  addMarker() { //to store location data in to json file under particlular user id
    var dt = new Date().getTime();
    this.locid = 'xyxx4xyxxxy9'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    console.log("location id", this.locid);

    let addressData = {
      locationid: this.locid,
      title: this.title,
      latitude: this.latlng.lat,
      longitude: this.latlng.lng,
      address: this.address
    }

    this.locData = [addressData];
    // this.locData.push(addressData)
    this.locationData = {
      [this.userId]: this.locData
    };
    console.log("location Data in map", this.locationData);
    //  this.locationservice.getLocationList().subscribe((result:any)=>{
    //   console.log("location list", result); 
    //  this.locationArray = result;

    if (this.locationArray.length == 0) {
      this.locationservice.addLocation(this.locationData).subscribe((response) => {
        console.log(response);
        this.getLocationDetails()
        this.locationHistory(this.locid)
        this.markerDisp(this.latlng)
      })

    } else {

      var keys = Object.keys(this.locationArray);
      //  console.log("keys",keys);

      for (var i = 0; i < this.locationArray.length; i++) {

        // console.log('match: ',this.locationArray[i])
        var keys = Object.keys(this.locationArray[i]);
        // console.log("keys",keys);

        if (keys[0] == this.userId) {
          console.log("key found", keys[0], keys[1]);
          console.log('before: ', this.locationArray[i][this.userId], this.userId)
          this.locationArray[i][this.userId].push(addressData)
          console.log('after: ', this.locationArray[i], this.locationArray[i].id)
          console.log("addressData", addressData);
          this.locationArray[i] = {
            [this.userId]: this.locationArray[i][this.userId],
            id: this.locationArray[i].id
          };
          console.log("update data", this.locationArray[i]);
          this.isUserIDfound = true;

          this.locationservice.updateLocation(this.locationArray[i]).subscribe((response) => {
            console.log(response);
            this.locationHistory(this.locid);
            this.markerDisp(this.latlng);
          })
        }

      }
      console.log("condition", this.isUserIDfound);


      if (this.isUserIDfound == true) {
        console.log("user found data added");

        return
      } else {
        console.log("user not found");

        this.locationservice.addLocation(this.locationData).subscribe((response) => {
          console.log(response);
          this.getLocationDetails()
          this.locationHistory(this.locid);
          this.markerDisp(this.latlng);
        })
      }
    }

  }

  markerDisp(latLong) { //display a pin or marker on the map
    var myIcon = L.icon({
      iconUrl: 'assets/pin.png',
      iconRetinaUrl: 'assets/pin.png',
      iconSize: [25, 24],
      iconAnchor: [9, 21],
      popupAnchor: [0, -14]
    });

    const lat = latLong.lat;
    const lon = latLong.lng;
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
      locationId: locID,
      trackLocationHistory: [{
        action: "created",
        time: currentDate
      }]
    }
    this.createData = [data]

    let locHistory = {
      [this.userId]: this.createData,
    }
    console.log("history data", locHistory);

    if (this.locationHistoryList.length == 0) {
      this.locationservice.addLocationHistory(locHistory).subscribe((result) => {
        console.log("location history added", result);
        this.getLocationHistory()

      })

    } else {

      var keys = Object.keys(this.locationHistoryList);
      console.log("keys", keys);

      for (var i = 0; i < this.locationHistoryList.length; i++) {

        // console.log('match: ', this.locationArray[i])
        var keys = Object.keys(this.locationHistoryList[i]);
        console.log("keys", keys);

        if (keys[0] == this.userId) {
          this.isLocationIDfound = true;
          console.log(keys[0], "matched", this.userId);
          console.log(this.locationHistoryList[i]);
          this.locationHistoryList[i][this.userId].push(data)
          console.log('after: ', this.locationHistoryList[i], this.locationHistoryList[i].id)
          console.log(" loc Data", data);
          this.locationHistoryList[i] = {
            [this.userId]: this.locationHistoryList[i][this.userId],
            id: this.locationHistoryList[i].id
          };
          console.log("update loc data", this.locationHistoryList[i]);


          this.locationservice.updateLocationHistory(this.locationHistoryList[i]).subscribe((response) => {
            console.log(response);

          })


        }

      }
      console.log("condition", this.isUserIDfound);


      if (this.isLocationIDfound == true) {
        console.log("location found data added");

        return
      } else {
        console.log("location not found");
        this.locationservice.addLocationHistory(locHistory).subscribe((result) => {
          console.log("location history added", result);
          this.getLocationHistory()
        })

      }
    }


  }

}
