import { Component, Input, OnInit } from "@angular/core";
import { ImageShow } from "../image-show.model";

@Component({
  selector: "app-show-list",
  templateUrl: "./show-list.component.html",
  styleUrls: ["./show-list.component.scss"],
})
export class ShowListComponent implements OnInit {
  @Input()
  area: string;

  imageShows: ImageShow[];

  imageShow: ImageShow;

  cols: any[] = [{ field: "name", header: "image-show.list.name" }];

  constructor() {}

  ngOnInit(): void {}

  newShow() {}
}
