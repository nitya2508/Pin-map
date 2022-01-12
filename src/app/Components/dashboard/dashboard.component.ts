import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  toggleCond=false;
  userList:any;
  index:any;
  userId:any;

  constructor(private oktaAuthService: OktaAuthService, private route : Router, private userservice: UserService) { }

  ngOnInit(){
    this.getAllUserList();
    this.signindetails();
  }

  getAllUserList(){
    this.userservice.getAllUsers().subscribe((result)=>{
      console.log(result)
      this.userList = result;
    })
  }

  async signindetails(){
    const userClaims = await this.oktaAuthService.getUser();
    console.log('user-claims', userClaims)
    console.log('Last name', userClaims.family_name,);
    console.log('First name', userClaims.given_name);
    console.log('email', userClaims.email);
    console.log('name', userClaims.name);

    // var dt = new Date().getTime();
    //     var uuid = 'xyxx4xyx'.replace(/[xy]/g, function(c) {
    //         var r = (dt + Math.random()*16)%16 | 0;
    //         dt = Math.floor(dt/16);        
    //         return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    //     });
    //     console.log(uuid);
        
    let registerData = {
      name : userClaims.name,
      email :userClaims.email,
      registrationType: "okta"
    }

  // console.log(registerData);

  
  for (let i = 0; i < this.userList.length; i++) {
    // delete this.userList[i].id;
    // delete this.userList[i].password;
    //  console.log("user",this.userList[i]);
    let empIdNameObject= _.pick(this.userList[i], "name","email", "registrationType");
  //  console.log("empIdNameObject", empIdNameObject);
   
    
    if (JSON.stringify(empIdNameObject) === JSON.stringify(registerData)) {
     console.log("already registered", this.userList[i],registerData,i);
     this.index=i
      // this.userservice.getAllUsers().subscribe((result)=>{
      //   // console.log(result)
      // let mainList=result;
      // console.log("mainlist",mainList);
       this.userId= this.userList[this.index].id;
      console.log("userId",this.userId);
      
      // })
    }else{
      // console.log("not registered", this.userList[i]);
      // this.userservice.addUser(registerData).subscribe((response)=>{
      //   console.log("user added",response)
      // })
      
    }
  }
  }

  logout(){
    this.oktaAuthService.signOut();
  }
  onChange(ob:any) {
    this.toggleCond=ob.checked;
    console.log(ob.checked, this.toggleCond);
    
    if(this.toggleCond==true){
      this.route.navigateByUrl('dashboard/table')
    }else{
      this.route.navigateByUrl('dashboard/map')
    }
  } 



}
function id(arg0: number, id: any) {
  throw new Error('Function not implemented.');
}

