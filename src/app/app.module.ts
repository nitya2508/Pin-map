import { NgModule , Injector} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatDividerModule} from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { OKTA_CONFIG,OktaAuthModule} from '@okta/okta-angular';
import { Router } from '@angular/router';
import pinMapConfig from './config/pin-map-config';
import { OktaComponent } from './Components/okta/okta.component';
import { MapComponent } from './Components/map/map.component';
import { TableComponent } from './Components/table/table.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DialogComponent } from './Components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewEditMapComponent } from './Components/view-edit-map/view-edit-map.component';
import { HeatmapComponent } from './Components/heatmap/heatmap.component';
import { NewDashboardComponent } from './Components/new-dashboard/new-dashboard.component';
import { PinnedLocComponent } from './Components/pinned-loc/pinned-loc.component';
import { AddHeatmapComponent } from './Components/add-heatmap/add-heatmap.component';
import { AddLocationsComponent } from './Components/add-locations/add-locations.component';
// import * as mapboxgl from 'mapbox-gl';

const oktaConfig = Object.assign({
  onAuthRequired: (OktaAuth:any, injector: Injector) => {
    const router = injector.get(Router);
    router.navigate(['/okta'])
  }
}, pinMapConfig.oidc)

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    DashboardComponent,
    OktaComponent,
    MapComponent,
    TableComponent,
    DialogComponent,
    ViewEditMapComponent,
    HeatmapComponent,
    NewDashboardComponent,
    PinnedLocComponent,
    AddHeatmapComponent,
    AddLocationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule,MatSnackBarModule,MatToolbarModule,
    BrowserAnimationsModule,FlexLayoutModule,MatDividerModule,MatIconModule,OktaAuthModule,
    MatSlideToggleModule, LeafletModule, MatDialogModule,MatSidenavModule,MatListModule,
    MatMenuModule
  
  ],
  providers: [
    {
      provide: OKTA_CONFIG, useValue: oktaConfig 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
