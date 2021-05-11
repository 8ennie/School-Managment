import { DragAndDropService } from './../../_services/drag-and-drop.service';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ImageShow } from "../image-show.model";
import { ImageShowService } from "../image-show.service";

@Component({
  selector: "app-show-list",
  templateUrl: "./show-list.component.html",
  styleUrls: ["./show-list.component.scss"],
})
export class ShowListComponent implements OnInit, OnChanges {
  @Input()
  area: string;

  imageShows: ImageShow[];
  imageShow: ImageShow;

  uploadImageShow: boolean = false;

  cols: any[] = [
    { field: "name", header: "image-show.list.name" },
    { field: "imageCount", header: "image-show.list.count" }
  ];

  constructor(
    private readonly imageShowService: ImageShowService,
    private readonly dragandDropService: DragAndDropService,
  ) { }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes.area) {
      this.imageShowService.getImageShowByArea(this.area).then((imageShows: ImageShow[]) => {
        this.imageShows = imageShows;
      });
    }
  }

  ngOnInit(): void {

  }

  newShow() {
    this.uploadImageShow = true;
  }

  dragStart(imageShow: ImageShow) {
    this.dragandDropService.drag('imageShow', imageShow);
  }

}
