import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { DataService } from 'src/app/services/datsservice/data.service';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'underscore';
import { HeatmapComponent } from '../heatmap/heatmap.component';
import { HeatmapService } from 'src/app/services/heatmapService/heatmap.service';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss']
})
export class NewDashboardComponent implements OnDestroy, OnInit{
  mobileQuery: MediaQueryList;

  toggleCond = false;
  userList: any;
  index: any;
  userId: any;
  isRegistered = false;
  heatmapList:any;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from(
    {length: 50},
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private oktaAuthService: OktaAuthService, private route: Router,
     private userservice: UserService, private dataservice: DataService, private router:ActivatedRoute,
     private heatmapService:HeatmapService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getAllUserList();
    this.signindetails();
  
    this.router.paramMap.subscribe(res=>{
      console.log("activated route",res);
      
    });
    this.dataservice.receiveHeatData.subscribe((result: any) => {
      console.log("received heat data", result);
      this.heatmapList=result;
    })
  
  }


  getAllUserList() {//fetching registered users list from db
    this.userservice.getAllUsers().subscribe((result) => {
      console.log(result)
      this.userList = result;
    })
  }

  async signindetails() {//get sign in user details through okta sign-in
    const userClaims = await this.oktaAuthService.getUser();
    console.log('user-claims', userClaims)
    console.log('Last name', userClaims.family_name,);
    console.log('First name', userClaims.given_name);
    console.log('email', userClaims.email);
    console.log('name', userClaims.name);

    var dt = new Date().getTime();
    var uuid = 'xyxx4xyx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    console.log(uuid);

    let registerData = {
      name: userClaims.name,
      email: userClaims.email,
      registrationType: "okta"
    }

    // console.log(registerData);




    for (let i = 0; i < this.userList.length; i++) {
      // delete this.userList[i].id;
      // delete this.userList[i].password;
      //  console.log("user",this.userList[i]);
      let empIdNameObject = _.pick(this.userList[i], "name", "email", "registrationType");
      //  console.log("empIdNameObject", empIdNameObject);


      if (JSON.stringify(empIdNameObject) === JSON.stringify(registerData)) {
        console.log("already registered", this.userList[i], registerData, i);
        this.index = i
        // this.userservice.getAllUsers().subscribe((result)=>{
        //   // console.log(result)
        // let mainList=result;
        // console.log("mainlist",mainList);
        this.userId = this.userList[this.index].id;
        console.log("userId", this.userId);
        this.isRegistered = true;
       
        localStorage.setItem('token',this.userId)
        console.log("token set" ,localStorage.getItem('token'));
        //  this.dataservice.sendId(this.userId)

       
        
        // })
      }


      // else{
      // console.log("not registered", this.userList[i]);
      // this.userservice.addUser(registerData).subscribe((response)=>{
      //   console.log("user added",response)
      // })

      // }
    }
    if (this.isRegistered == true) {
      console.log("already reg go ahead");
      return
    } else {
      console.log("not reg u are new user");

      let registerData = {
        name: userClaims.name,
        email: userClaims.email,
        password: "",
        id: uuid,
        registrationType: "okta"
      }
      this.userservice.addUser(registerData).subscribe((response:any) => {
        console.log("user added", response)
         this.dataservice.sendId(response.id)
      })

    }
   
  }

  heatmapChoosed(data:any){//sharing data on choosing heat map from the list
    console.log("choosed heat map is ====", data.name);
    this.dataservice.sendHeatmapData(data);
  }

  logout() {
    this.oktaAuthService.signOut();
    localStorage.clear();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
