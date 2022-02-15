import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as L from 'leaflet';
// import 'heatmap.js';
import "leaflet.heat";
import { DataService } from 'src/app/services/datsservice/data.service';
import { HeatmapService } from 'src/app/services/heatmapService/heatmap.service';
// import { addressPoints } from '../../../assets/realworld.10000';
import { AddHeatmapComponent } from '../add-heatmap/add-heatmap.component';

declare const HeatmapOverlay: any;

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnInit {
  private map: any;
  HeatmapOverlay: any
  newAddpoint: any = [];
  coordinates: any;
  heatmapName: any;
  userId: any;
  heatid: any;
  heatData: any;
  heatmapList: any;
  locData: any;
  isUserIDfound = false;
  heatmap_user: any;
  heatmap_name: any;
  heatmap_lat: any;
  heatmap_lon: any;
  heatlocationsArray:any;
  addressPoints:any;

  constructor(public dialog: MatDialog, private http: HttpClient, private heatmapService: HeatmapService,
    private dataservice: DataService, private route:Router) { };
  ngOnInit(): void {
    this.userId = localStorage.getItem('token');
    console.log(this.userId);
    this.getHeatmaplist();

    this.dataservice.receiveHeatmapData.subscribe((result: any) => {
      console.log("received heat data", result);
      this.heatmap_user=result;
      console.log("this map=====", this.map);
      if (this.map != undefined) {
         this.map.remove();
         this.heatmapChoosed( this.heatmap_user);
         }else if(this.map == undefined){
          this.heatmapChoosed( this.heatmap_user);
         }
     
      // this.heatmapChoosed( this.heatmap_user);
    })
  }

  // ngAfterViewInit(): void {
  //   this.initMap();

  // }

  private initMap(): void {
    // Initialising map with center point by using the coordinates
    // Setting initial zoom to 3
    this.map = L.map('map', {
      // center: [23.2237, 77.4126],
      center:[this.heatmap_lat, this.heatmap_lon],
      zoom: 7
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
    this.addHeatMap();
  }

  //function to highlight points on the heat map
  addHeatMap() {
    this.newAddpoint = this.addressPoints;
    let heat = L.heatLayer(this.newAddpoint
      // lat, lng, intensity
      , {
        radius: 35,
        minOpacity: 1,
        gradient: { 0.3: 'blue', 0.8: 'lime', 1: 'red' }
      }).addTo(this.map);
  }

  //function to get the list of all the heat maps of all users
  getHeatmaplist() {
    this.heatmapService.getHeatmap().subscribe((response) => {
      console.log("heatmap list", response);
      this.heatmapList = response;
      this.heatList();
    })
  }

  //function to fetch the heat map of the user logged in
  heatList() {
    var keys = Object.keys(this.heatmapList);
    //  console.log("keys========",keys);

    for (var i = 0; i < this.heatmapList.length; i++) {

      //  console.log('match:=========== ',this.heatmapList[i])
      var keys = Object.keys(this.heatmapList[i]);
      console.log("keys", keys, 'of', this.heatmapList[i], this.userId);

      if (keys[0] == this.userId) {
        console.log("key found===========", keys[0], keys[1]);
        console.log('before:=========== ', this.heatmapList[i][this.userId], this.userId);
        this.heatmap_user = this.heatmapList[i][this.userId][0];
        this.dataservice.sendHeatData(this.heatmapList[i][this.userId]);
       this.heatmapChoosed(this.heatmap_user);
      }

    }
  }

  //function to display particular heat map
  heatmapChoosed(heatmap){
    this.heatmap_name= heatmap.name;
    this.heatmap_lat=heatmap.latitude;
    this.heatmap_lon=heatmap.longitude;
    console.log("heat map choosed =====",heatmap);
    // this.map.setView(new L.LatLng(this.heatmap_lat,this.heatmap_lon), 9 );
    this.heatmapService.getHeatmapLocation().subscribe((response)=>{
      console.log("heatmap locations", response);
      this.heatlocationsArray=response;
      for (var a = 0; a < this.heatlocationsArray.length; a++){
        var keys = Object.keys(this.heatlocationsArray[a]);
        console.log("keys", keys, 'of',this.heatlocationsArray[a], this.userId);
        if (keys[0] == this.userId) {
          console.log("key found===========", keys[0], keys[1]);
          console.log('before:=========== ', this.heatlocationsArray[a][this.userId], this.userId);
          let heatArray=this.heatlocationsArray[a][this.userId];

          for (var b = 0; b < heatArray.length; b++){
            var keys = Object.keys(heatArray[b]);
            console.log("location keys", keys, 'of',heatArray[b], this.userId);
            if (keys == heatmap.heatmapId){
              console.log('loc array:=========== ', heatArray[b][heatmap.heatmapId],  heatmap.heatmapId);
              this.addressPoints=heatArray[b][heatmap.heatmapId]
              console.log("add points", this.addressPoints);
              
            }
          }
          this.initMap();
        }
      }
    })
    
    //  this.initMap();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddHeatmapComponent, {
      width: '400px',
      height: '250px',
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.heatmapName = result;
      if (result == null || result == 'undefined') {
        return;
      } else {
        this.http.get("https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + result).subscribe((req: any) => {
          console.log("address", req[0].lat, req[0].lon);
          this.coordinates = req[0];
          this.addHeatmapData();
        })
      }


    });
  }

  //function to add heatmap on to the json file 
  addHeatmapData() {
    var dt = new Date().getTime();
    this.heatid = 'xyxyxy'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    let heatData = {
      heatmapId: this.heatid,
      name: this.heatmapName,
      latitude: this.coordinates.lat,
      longitude: this.coordinates.lon
    }
    console.log("heat data", heatData);
    this.locData = [heatData];
    this.heatData = {
      [this.userId]: this.locData
    };

    if (this.heatmapList.length == 0) {
      this.heatmapService.addHeatmap(this.heatData).subscribe((result) => {
        console.log("data added", result);
        this.getHeatmaplist();
      })

    } else {

      var keys = Object.keys(this.heatmapList);
      //  console.log("keys",keys);

      for (var i = 0; i < this.heatmapList.length; i++) {

        // console.log('match: ',this.locationArray[i])
        var keys = Object.keys(this.heatmapList[i]);
        // console.log("keys",keys);

        if (keys[0] == this.userId) {
          console.log("key found", keys[0], keys[1]);
          console.log('before: ', this.heatmapList[i][this.userId], this.userId)
          this.heatmapList[i][this.userId].push(heatData)
          console.log('after: ', this.heatmapList[i], this.heatmapList[i].id)
          console.log("addressData", heatData);
          this.heatmapList[i] = {
            [this.userId]: this.heatmapList[i][this.userId],
            id: this.heatmapList[i].id
          };
          console.log("update data", this.heatmapList[i]);
          this.isUserIDfound = true;

          this.heatmapService.updateHeatmap(this.heatmapList[i]).subscribe((response) => {
            console.log(response);

          })
        }

      }
      console.log("condition", this.isUserIDfound);


      if (this.isUserIDfound == true) {
        console.log("user found data added");

        return
      } else {
        console.log("user not found");

        this.heatmapService.addHeatmap(this.heatData).subscribe((response) => {
          console.log(response);
          this.getHeatmaplist();

        })
      }

    }


  }

  add_Locations(){
    console.log("add locations",this.heatmap_user);
     this.dataservice.sendLocData(this.heatmap_user);
    this.route.navigateByUrl("/newDashboard/heatLocations")

  }





}
