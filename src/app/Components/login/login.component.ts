import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import pinMapConfig from 'src/app/config/pin-map-config';
import * as OktaSignIn from '@okta/okta-signin-widget';
import { OktaAuthService } from '@okta/okta-angular';
import { localizedString } from '@angular/compiler/src/output/output_ast';
import { DataService } from 'src/app/services/datsservice/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signInForm!: FormGroup;
  submitted = false;
  userList: any;
  oktaSignin:any;
  isoktalogin=true;
  oktaToken:any;

  constructor(private formBuilder: FormBuilder, private snackbar: MatSnackBar, private userservice: UserService,
    private route: Router, private oktaAuthService: OktaAuthService, private dataservice: DataService) { 
      // this.oktaSignin = new OktaSignIn({
      //   // logo: '../../asstes/pin.png',
      //   features:{
      //     registration: true
      //   },
      //   baseUrl: pinMapConfig.oidc.issuer.split('/oauth2')[0],
      //   clientId: pinMapConfig.oidc.clientId,
      //   redirectUrl: pinMapConfig.oidc.redirectUri,
      //   authParams: {
      //     pkce: true,
      //     issuer: pinMapConfig.oidc.issuer,
      //     scopes: pinMapConfig.oidc.scopes
      //   }
      // })
    }

    ngOnInit(): void {
      // this.openIdConnect()
      
      this.oktaToken=localStorage.key(3);
      console.log("okta token",  this.oktaToken);
     
      if(this.oktaToken=="okta-token-storage"){
        console.log(localStorage.getItem(this.oktaToken));
        this.route.navigateByUrl('/newDashboard/pinnedLocation/map')
      }

      this.getAllUserList()
  
      this.signInForm = this.formBuilder.group({
        // email: ['',[Validators.required, Validators.email]],
        // password: ['',[Validators.required, Validators.minLength(6)]]
  
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
   
    
    }
  
    getAllUserList() {
      this.userservice.getAllUsers().subscribe((result) => {
        console.log(result)
        this.userList = result;
      })
    }
    submitForm(){
      this.route.navigateByUrl('/okta')
    }
    // openIdConnect() {
    //   console.log("inside openid");
    //   this.isoktalogin=true
     
      // this.oktaSignin.renderEL({el: '#okta-sign-in-widget'},
      // (response:any) =>{
      //   if(response.status === 'SUCCESS'){
      //     this.oktaAuthService.signInWithRedirect();
      //   }
      // },(error:any)=>{
      //   throw error;
      // });
    //   this.oktaSignin.renderEl({el: '#okta-sign-in-widget'},
    //     (response: any) => {
    //       if (response.status === 'SUCCESS') {
    //         this.oktaAuthService.signInWithRedirect();
    //       }
    //     }, (error: any) => {
    //       throw error;
    //     });
      
    // }
  
    register(){
      this.route.navigateByUrl('/register')
    }
  
    onSubmit() {
      this.submitted = true;
  
      console.log("inside submit")
      if (this.signInForm.valid) {
        console.log("valid", this.signInForm.value);
        const Email = this.userList.some((el: any) => el.email === this.signInForm.value.email);
        // console.log(Email);
  
        if (Email == true) {
          // console.log("ligin now");
          let index = this.userList.findIndex((x: any) => x.email === this.signInForm.value.email);
          // console.log(index, this.signInForm.value.email);
          if (this.userList[index].password == this.signInForm.value.password) {
            console.log("login user details",this.userList[index]);
            localStorage.setItem('token', this.userList[index].id)
            this.dataservice.sendId(this.userList[index].id)
            this.route.navigateByUrl('/newDashboard/pinnedLocation/map')
            console.log("email and password match valid user");
            this.snackbar.open("SignIn successful !!!!", '', {
              duration: 3000,
            })
            
          } else {
            console.log("password doesnot match wrong password");
            this.snackbar.open("Enter valid Password", '', {
              duration: 3000,
            })
  
          }
  
  
        } else {
          console.log("email not registered");
          this.snackbar.open("Email not found", '', {
            duration: 3000,
          })
  
        }
  
  
  
      } else {
        console.log("invalid");
        this.snackbar.open("Enter valid information", '', {
          duration: 3000,
        })
  
      }
    }

}
