import { Subject } from 'rxjs';

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-area-overview",
  templateUrl: "./area-overview.component.html",
  styleUrls: ["./area-overview.component.scss"],
})
export class AreaOverviewComponent implements OnInit {
  public area: string;
  public updateMonitors: Subject<void> = new Subject<void>();

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((parms: Params) => {
      this.area = parms["area"];
    });
  }


  public onImageShowUpdate(): void {

    setTimeout(() => this.updateMonitors.next(), 5000);

  }
}
