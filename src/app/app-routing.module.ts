import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular';
import { OktaComponent } from './Components/okta/okta.component';
import { MapComponent } from './Components/map/map.component';
import { TableComponent } from './Components/table/table.component';
import { ViewEditMapComponent } from './Components/view-edit-map/view-edit-map.component';
import { HeatmapComponent } from './Components/heatmap/heatmap.component';
import { AuthGuard } from './Authguard/auth.guard';
import { NewDashboardComponent } from './Components/new-dashboard/new-dashboard.component';
import { PinnedLocComponent } from './Components/pinned-loc/pinned-loc.component';
import { AddLocationsComponent } from './Components/add-locations/add-locations.component';

const routes: Routes = [
  {path:'register',component:RegistrationComponent},
  {path: 'login/callback',component: OktaCallbackComponent},
  {path:'login',component:LoginComponent},
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'okta',component:OktaComponent},
  // {path:'map',component:MapComponent},
  
  {path:'newDashboard',component:NewDashboardComponent,
  children:[
    {path:'pinnedLocation',component:PinnedLocComponent,
      children:[
        {path:'map',component:MapComponent},
      {path:'table',component:TableComponent},
      {path:'editView',component:ViewEditMapComponent},
      ]
    },
    {path:'heatmap',component:HeatmapComponent},
    {path:'heatLocations',component:AddLocationsComponent},
  ]
},
  {path:'dashboard',component:DashboardComponent,
  children:[
    {path:'',redirectTo:"/dashboard/map",pathMatch:'full'},
    {path:'map',component:MapComponent},
    {path:'table',component:TableComponent},
    {path:'editView',component:ViewEditMapComponent},
    {path:'heatmap',component:HeatmapComponent}
  ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
