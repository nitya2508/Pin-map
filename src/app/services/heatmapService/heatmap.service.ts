import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeatmapService {

  constructor(private http:HttpClient) { }

  addHeatmap(data:any){
   return this.http.post('http://localhost:3000/heatmap', data)
  }

  getHeatmap(){
   return this.http.get('http://localhost:3000/heatmap')
  }

  updateHeatmap(data:any){
    console.log("data",data);
    
    return this.http.put('http://localhost:3000/heatmap/'+data.id, data);
  }

  addHeatmapLocation(payload:any){
    return this.http.post(' http://localhost:3000/heatmapLocations',payload)
   } 

   getHeatmapLocation(){
    return this.http.get(' http://localhost:3000/heatmapLocations')
   } 

   updateHeatmapLocation(data:any){
    console.log("data",data);
    
    return this.http.put('http://localhost:3000/heatmapLocations/'+data.id, data);
  }

}
