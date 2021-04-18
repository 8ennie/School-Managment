import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HeaderService } from "src/app/header/header.service";
import { ImageShow } from "../image-show.model";
import { ImageShowService } from "../image-show.service";
import { ShowPart } from "../show-part/show-part.model";
import { ShowPartService } from "../show-part/show-part.service";

@Component({
  selector: "app-show",
  templateUrl: "./show.component.html",
  styleUrls: ["./show.component.scss"],
})
export class ShowComponent implements OnInit {
  @Input()
  height: number;

  @Input()
  preview = false;

  @Input()
  imageShowResorceUrl: string;

  imageShow: ImageShow;

  showParts: ShowPart[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly imageShowService: ImageShowService,
    private readonly showPartService: ShowPartService,
    private readonly headerService: HeaderService
  ) {}

  ngOnInit(): void {
    if (!this.preview) {
      this.headerService.hideHeader();
      this.activatedRoute.params.subscribe((parms: Params) => {
        this.imageShowResorceUrl = this.imageShowService.getImageShowResourceUrl(
          parms["id"]
        );
      });
    }
    if (this.imageShowResorceUrl) {
      this.imageShowService
        .getImageShow(this.imageShowResorceUrl)
        .then((imageShow: ImageShow) => {
          this.imageShow = imageShow;
          this.showPartService
            .getShowPartsFromImageShow(imageShow.resourceUrl)
            .then((showParts: ShowPart[]) => {
              this.showParts = showParts;
            });
        });
    }
  }

  public getImage(image: string) {
    return "data:image/JPEG;base64," + image;
  }

  public getHeight(): number {
    if (this.preview) {
      return this.height;
    } else {
      return window.innerHeight - 65;
    }
  }
}
