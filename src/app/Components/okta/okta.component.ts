import { Component, OnInit } from '@angular/core';
import pinMapConfig from 'src/app/config/pin-map-config';
import * as OktaSignIn from '@okta/okta-signin-widget';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-okta',
  templateUrl: './okta.component.html',
  styleUrls: ['./okta.component.scss']
})
export class OktaComponent implements OnInit {
  oktaSignin:any;

  constructor( private oktaAuthService: OktaAuthService) {
    this.oktaSignin = new OktaSignIn({
      // logo: '../../asstes/pin.png',
      features:{
        registration: true
      },
      baseUrl: pinMapConfig.oidc.issuer.split('/oauth2')[0],
      clientId: pinMapConfig.oidc.clientId,
      redirectUri: pinMapConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: pinMapConfig.oidc.issuer,
        scopes: pinMapConfig.oidc.scopes
      }
    })
   }

  ngOnInit(): void {
    this.openIdConnect();
  }

  openIdConnect():void {
    console.log("inside openid");
  
   
    // this.oktaSignin.renderEL({el: '#okta-sign-in-widget'},
    // (response:any) =>{
    //   if(response.status === 'SUCCESS'){
    //     this.oktaAuthService.signInWithRedirect();
    //   }
    // },(error:any)=>{
    //   throw error;
    // });
    this.oktaSignin.renderEl({el: '#okta-sign-in-widget'},
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect();
        }
      }, (error: any) => {
        throw error;
      });
    
  }

}
