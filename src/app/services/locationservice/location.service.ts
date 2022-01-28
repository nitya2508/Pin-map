import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // http://localhost:3000/location;

  constructor(private http: HttpClient) { }

  

  addLocation(locatinData:any){
    console.log("location service",locatinData);
    const result =  this.http.post('http://localhost:3000/location',locatinData);
    return result
  }

  getLocationList(){
    return this.http.get('http://localhost:3000/location');
   }

  updateLocation(data:any){
    console.log("data",data);
    
    return this.http.put('http://localhost:3000/location/'+data.id, data);
  }

  getLocationHistoryList(){
    return this.http.get(' http://localhost:3000/locationHistory');
   }

  addLocationHistory(payload:any){
   return this.http.post(' http://localhost:3000/locationHistory',payload)
  } 

  updateLocationHistory(data:any){
    console.log("data",data);
    
    return this.http.put('http://localhost:3000/locationHistory/'+data.id, data);
  }
}
