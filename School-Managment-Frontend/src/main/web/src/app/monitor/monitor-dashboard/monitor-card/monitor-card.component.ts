import { Component, Input, OnInit } from "@angular/core";
import { ImageShow } from "src/app/image-show/image-show.model";
import { Monitor } from "../../monitor.model";

@Component({
  selector: "app-monitor-card",
  templateUrl: "./monitor-card.component.html",
  styleUrls: ["./monitor-card.component.scss"],
})
export class MonitorCardComponent implements OnInit {
  @Input()
  monitor: Monitor;

  imageShow: ImageShow;

  imageShows: ImageShow[];
  constructor() {}

  ngOnInit(): void {}
}
