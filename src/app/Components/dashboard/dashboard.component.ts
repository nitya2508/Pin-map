import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  toggleCond=false;
  userList:any;

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
    console.log('name', userClaims.name)

    const Email = this.userList.some((el: any) => el.email === userClaims.email);
    const Name = this.userList.some((el: any) => el.name === userClaims.name);
    let index = this.userList.findIndex((x: any) => x.email ===userClaims.email);
    console.log(Email, this.userList[index].registrationType, index)

    if (Email==true && Name==true){
      let index = this.userList.findIndex((x: any) => x.email ===userClaims.email);
      console.log(Email, this.userList[index].registrationType, index)
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
