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
  locationList:any;
  id: any;

  constructor(private locationService: LocationService, private dataservice: DataService, private route: Router) { }

  ngOnInit(): void {
    this.getLocationDetails()

    this.dataservice.receiveId.subscribe((result:any)=>{
      console.log("received Id", result);
      this.userId= result;
      
    })
  }

getLocationDetails(){
 this.locationService.getLocationList().subscribe((result:any)=>{
   console.log("location Array", result);
   this.locationArray = result;

   var keys = Object.keys(this.locationArray);
    //  console.log("keys",keys);

     for (var i = 0; i < this.locationArray.length; i++) {
      
        // console.log('match: ',this.locationArray[i])
        var keys = Object.keys(this.locationArray[i]);
        // console.log("keys",keys);

        if(keys[0] == this.userId){
          console.log("key found",keys[0], keys[1]);
          console.log('before: ',this.locationArray[i][this.userId]);
          this.locationList=this.locationArray[i][this.userId];
          this.id=this.locationArray[i].id
          console.log("location list",this.locationList,this.id)
           return
       
        }else{
          console.log("key not found");
          
        }
    }

 })
}
viewLocation(data:any, index){
  let location=data;
  let viewlocationData = {
    userId:this.userId,
    arrayList:this.locationList,
    id:this.id,
    location:data,
    index:index
  }
  console.log("data", location, index);
  
  this.route.navigateByUrl('/dashboard/editView')
  this.dataservice.sendLocationData(viewlocationData)
}

//    create_UUID(){
//     var dt = new Date().getTime();
//     var uuid = 'xyxx4xyxxxy9'.replace(/[xy]/g, function(c) {
//         var r = (dt + Math.random()*16)%16 | 0;
//         dt = Math.floor(dt/16);        
//         return (c=='x' ? r :(r&0x3|0x8)).toString(16);
//     });

//     let id= uuid
//    console.log(uuid,id);
   
// }



}
