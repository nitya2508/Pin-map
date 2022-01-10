import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular';
import { OktaComponent } from './Components/okta/okta.component';
import { MapComponent } from './Components/map/map.component';
import { TableComponent } from './Components/table/table.component';

const routes: Routes = [
  {path:'register',component:RegistrationComponent},
  {path: 'login/callback',component: OktaCallbackComponent},
  {path:'login',component:LoginComponent},
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'okta',component:OktaComponent},
  // {path:'map',component:MapComponent},
  {path:'dashboard',component:DashboardComponent, canActivate:[OktaAuthGuard],
  children:[
    {path:'',redirectTo:"/dashboard/map",pathMatch:'full'},
    {path:'map',component:MapComponent},
    {path:'table',component:TableComponent},
  ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
