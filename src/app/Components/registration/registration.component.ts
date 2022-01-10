import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  userList:any;

  constructor(private userservice: UserService, private snackbar: MatSnackBar, private route: Router) { }

  ngOnInit(): void {
    this.getAllUserList()
  }

  getAllUserList(){
    this.userservice.getAllUsers().subscribe((result)=>{
      // console.log(result)
      this.userList = result;
    })
  }

  openId(){
    this.route.navigateByUrl('/login')
  }

  regUser(regObj:any){
    console.log("inside reg user",regObj);

    const found = this.userList.some((el:any)=> el.email === regObj.email);
    // console.log(found);

    
    if(found == true){
      // console.log("user alredy registered");
      this.snackbar.open('Email already Registered !', '',{
        duration: 3000,
      })
      
    }
    else{
      
       
      this.userservice.addUser(regObj).subscribe((response)=>{
          console.log("user added",response)

          this.snackbar.open('User Registered Successfully !', '',{
            duration: 3000,
          })
    
        },error=>{

          this.snackbar.open('Error !', '',{
            duration: 3000,
          })

        })
    }

  }

}
