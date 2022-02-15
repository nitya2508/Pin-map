import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/datsservice/data.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeatmapService } from 'src/app/services/heatmapService/heatmap.service';


@Component({
  selector: 'app-add-locations',
  templateUrl: './add-locations.component.html',
  styleUrls: ['./add-locations.component.scss']
})
export class AddLocationsComponent implements OnInit {
  private map: any;
  latlng: any;
  address: any;
  data: any;
  locname: any;
  createData: any;
  userId: any;
  heatLocList: any;
  isLocationIDfound = false;
  isHeatmapLocFound = false;

  constructor(private dataservice: DataService, private http: HttpClient, private route: Router,
    private heatmapService: HeatmapService) { }

  ngOnInit(): void {

    this.userId = localStorage.getItem('token')

    this.dataservice.receiveLocData.subscribe((result: any) => {
      console.log("received heat data", result);
      this.data = result;
      console.log("data", result);

    })

    this.getHeatLoc();

    console.log("add locations map ====", this.map);
    if (this.map != undefined) {
      this.map.remove();
      console.log("inside if");
      this.ngAfterViewInit();

    } else {
      console.log("inside else");

      this.ngAfterViewInit();

    }

  }
  ngAfterViewInit(): void {
    // if (this.map != undefined) {
    // this.map.remove();
    this.initMap();
    this.getLocation();
    // }

    // this.getLocationHistory();
  }


  // centroid: L.LatLngExpression = [23.2599, 77.4126];

  initMap(): void {
    this.map = L.map('map', {
      center: [this.data.latitude, this.data.longitude],
      zoom: 8
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

  }

  getLocation() { //to pin a location on the map and get address 
    this.locname = this.data.name
    this.map.on("click", e => {
      console.log(e.latlng); // get the coordinates
      this.latlng = e.latlng
      this.markerDisp(this.latlng)
      this.addHeatLoc(this.latlng)
      // this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`).subscribe((req: any) => {
      //   console.log("address", req.display_name);
      //   this.address = req.display_name;
      // })
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

  backToHeatmap() {
    this.route.navigateByUrl("/newDashboard/heatmap")
  }

  getHeatLoc() {
    this.heatmapService.getHeatmapLocation().subscribe((response: any) => {
      console.log("heat loc list", response);
      this.heatLocList = response;
    })
  }

  addHeatLoc(loc) {//adding location history on to db
    console.log("location detalis", loc);

    let heatmapData = {
      latitude: this.latlng.lat,
      longitude: this.latlng.lng,
      intensity: "18"
    }

    let data = {
      [this.data.heatmapId]: [heatmapData]
    }
    this.createData = [data]

    let locHistory = {
      [this.userId]: this.createData,
    }
    console.log("history data", locHistory);

    if (this.heatLocList.length == 0) {
      this.heatmapService.addHeatmapLocation(locHistory).subscribe((result) => {
        console.log("location history added", result);
        this.getHeatLoc()

      })

    } else {

      var keys = Object.keys(this.heatLocList);
      console.log("keys", keys);

      for (var i = 0; i < this.heatLocList.length; i++) {

        // console.log('match: ', this.locationArray[i])
        var keys = Object.keys(this.heatLocList[i]);
        console.log("keys", keys);

        if (keys[0] == this.userId) {
          this.isLocationIDfound = true;
          console.log(keys[0], "matched", this.userId);
          console.log(this.heatLocList[i][this.userId]);

          for (var k = 0; k < this.heatLocList[i][this.userId].length; k++) {
            var keys = Object.keys(this.heatLocList[i][this.userId][k]);
            console.log("keys", keys);
            if (keys == this.data.heatmapId) {
              console.log("***********", this.heatLocList[i][this.userId][k][this.data.heatmapId]);
              this.isHeatmapLocFound = true;
              this.heatLocList[i][this.userId][k][this.data.heatmapId].push(heatmapData);
              this.heatLocList[i] = {
                [this.userId]: this.heatLocList[i][this.userId],
                id: this.heatLocList[i].id
              };
              this.heatmapService.updateHeatmapLocation(this.heatLocList[i]).subscribe((res: any) => {
                console.log(" location added to heat map");

              })
            }
          }
          if (this.isHeatmapLocFound == true) {
            console.log("location found data added");
    
            return
          } else {
            console.log("location not found");
            this.heatLocList[i][this.userId].push(data);
            this.heatLocList[i] = {
              [this.userId]: this.heatLocList[i][this.userId],
              id: this.heatLocList[i].id
            };
            this.heatmapService.updateHeatmapLocation(this.heatLocList[i]).subscribe((result) => {
              console.log("location history added", result);
              this.getHeatLoc()
            })
    
          }

        }

      }
      console.log("condition",);


      if (this.isLocationIDfound == true) {
        console.log("location found data added");

        return
      } else {
        console.log("location not found");
        this.heatmapService.addHeatmapLocation(locHistory).subscribe((result) => {
          console.log("location history added", result);
          this.getHeatLoc()
        })

      }
    }


  }

}
