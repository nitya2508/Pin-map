import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  addUser(data:any){
   return  this.http.post('http://localhost:3000/users', data)

  }
  getAllUsers(){
    return this.http.get('http://localhost:3000/users')
  }
}
