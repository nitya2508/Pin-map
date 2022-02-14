import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-heatmap',
  templateUrl: './add-heatmap.component.html',
  styleUrls: ['./add-heatmap.component.scss']
})
export class AddHeatmapComponent implements OnInit {
heatmapName:any;

  constructor( public dialogRef: MatDialogRef<AddHeatmapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
   
   }

  ngOnInit(): void {
  }

  saveData(): void {
    console.log("heatmapName",this.heatmapName);
    
    this.dialogRef.close(this.heatmapName);
  }

}


