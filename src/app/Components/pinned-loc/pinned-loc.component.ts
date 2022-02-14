import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pinned-loc',
  templateUrl: './pinned-loc.component.html',
  styleUrls: ['./pinned-loc.component.scss']
})
export class PinnedLocComponent implements OnInit {
  toggleCond = false;

  constructor(private route: Router, private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(res=>{
      console.log("activated route",res);
      
    })
  }

  onChange(ob: any) {//function to switch between map and table view
    this.toggleCond = ob.checked;
    console.log(ob.checked, this.toggleCond);

    if (this.toggleCond == true) {
      this.route.navigateByUrl('newDashboard/pinnedLocation/table')
    } else {
      this.route.navigateByUrl('newDashboard/pinnedLocation/map')
    }
  }

}
