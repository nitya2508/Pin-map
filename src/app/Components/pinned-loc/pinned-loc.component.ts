import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pinned-loc',
  templateUrl: './pinned-loc.component.html',
  styleUrls: ['./pinned-loc.component.scss']
})
export class PinnedLocComponent implements OnInit {
  toggleCond = false;

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  onChange(ob: any) {
    this.toggleCond = ob.checked;
    console.log(ob.checked, this.toggleCond);

    if (this.toggleCond == true) {
      this.route.navigateByUrl('newDashboard/pinnedLocation/table')
    } else {
      this.route.navigateByUrl('newDashboard/pinnedLocation/map')
    }
  }

}
