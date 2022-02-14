import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/datsservice/data.service';
import { LocationService } from 'src/app/services/locationservice/location.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  locationArray: any;
  userId: any;
  locationList: any;
  id: any;
  locationHistoryList: any;
  isLocationIDfound= false;
  locHistoryArray: any;

  constructor(private locationService: LocationService, private dataservice: DataService, private route: Router) { }

  ngOnInit(): void {
    this.getLocationDetails()

    this.dataservice.receiveId.subscribe((result: any) => {
      console.log("received Id", result);
      this.userId = localStorage.getItem('token');

    })
    this.getLocationHistory()
  }

  getLocationDetails() {
    this.locationService.getLocationList().subscribe((result: any) => {
      console.log("location Array", result);
      this.locationArray = result;

      var keys = Object.keys(this.locationArray);
      //  console.log("keys",keys);

      for (var i = 0; i < this.locationArray.length; i++) {

        // console.log('match: ',this.locationArray[i])
        var keys = Object.keys(this.locationArray[i]);
        // console.log("keys",keys);

        if (keys[0] == this.userId) {
          console.log("key found", keys[0], keys[1]);
          console.log('before: ', this.locationArray[i][this.userId]);
          this.locationList = this.locationArray[i][this.userId];
          this.id = this.locationArray[i].id
          console.log("location list", this.locationList, this.id)
          return

        } else {
          console.log("key not found");

        }
      }

    })
  }
  viewLocation(data: any, index) {
    let location = data;
    let viewlocationData = {
      userId: this.userId,
      arrayList: this.locationList,
      id: this.id,
      location: data,
      index: index
    }
    console.log("data", location, index);

    this.route.navigateByUrl('/newDashboard/pinnedLocation/editView')
    this.dataservice.sendLocationData(viewlocationData)
  }

  deleteLocation(deleteData, deleteIndex) {
    console.log("to be deleted", deleteData, deleteIndex);
    console.log("before", this.locationArray);

    for (let a = 0; a < this.locationArray.length; a++) {    

    var keys = Object.keys(this.locationArray[a]);
        // console.log("keys",keys);

        if (keys[0] == this.userId) {
          console.log("key found", keys[0], keys[1]);
          console.log('before: ', this.locationArray[a][this.userId], this.userId)
          let array= this.locationArray[a][this.userId];
          for (let l = 0; l < array.length; l++) {
            if (array[l] == deleteData) {
                console.log(array[l], "matched", deleteData);
        
                array.splice(l, 1);
                 console.log("spliced",array);
              }else {
                console.log(array[l], "not matched", deleteData);
              }  

            }
          this.locationArray[a] = {
            [this.userId]: this.locationArray[a][this.userId],
            id: this.locationArray[a].id
          };
          console.log("update data", this.locationArray[a]);
          
         
          this.locationService.updateLocation(this.locationArray[a]).subscribe((response) => {
            console.log(response);
            this.locationHistory(deleteData.locationid);
          })
          
        }

      }

  }

  getLocationHistory() {
    this.locationService.getLocationHistoryList().subscribe((response) => {
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

      action: "deleted",
      time: currentDate

    }

    var keys = Object.keys(this.locationHistoryList);
    console.log("keys", keys);

    for (var i = 0; i < this.locationHistoryList.length; i++) {

      // console.log('match: ', this.locationArray[i])
      var keys = Object.keys(this.locationHistoryList[i]);
      console.log("keys", keys);

      if (keys[0] == this.userId) {
        this.isLocationIDfound = true;
        console.log(keys[0], "matched", this.userId);
        console.log(this.locationHistoryList[i][this.userId]);
        this.locHistoryArray = this.locationHistoryList[i][this.userId]
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
              [this.userId]: this.locationHistoryList[i][this.userId],
              id: this.locationHistoryList[i].id
            };
            console.log("sending data", this.locationHistoryList[i]);
            this.locationService.updateLocationHistory(this.locationHistoryList[i]).subscribe((response) => {
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
