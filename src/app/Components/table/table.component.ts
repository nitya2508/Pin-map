import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

   create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xyxx4xyx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);        
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });

    let id= uuid
   console.log(uuid,id);
   
}



}
