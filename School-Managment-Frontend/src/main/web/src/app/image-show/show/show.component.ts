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
  imageShowResorceUrl: string;

  @Input()
  defaultDisplayTime: number = 6;

  imageShow: ImageShow;

  showParts: ShowPart[] = [];

  page: number = 0;

  private timer;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly imageShowService: ImageShowService,
    private readonly showPartService: ShowPartService,
    private readonly headerService: HeaderService
  ) { }

  ngOnInit(): void {

    this.headerService.hideHeader();
    this.activatedRoute.params.subscribe((parms: Params) => {
      this.imageShowResorceUrl = this.imageShowService.getImageShowResourceUrl(
        parms["id"]
      );
    });
    if (this.imageShowResorceUrl) {
      this.imageShowService
        .getImageShow(this.imageShowResorceUrl)
        .then((imageShow: ImageShow) => {
          this.imageShow = imageShow;
          this.showPartService
            .getShowPartsFromImageShow(imageShow.resourceUrl)
            .then((showParts: ShowPart[]) => {
              this.showParts = showParts.filter(sp => sp.active);
              this.pageChanged({ page: 0 });
            });
        });

    }

  }

  public getImage(image: string) {
    return "data:image/JPEG;base64," + image;
  }

  public getHeight(): number {
    return window.innerHeight - 70;
  }

  public pageChanged(event: { page: number }): void {
    const currentPage = event.page;
    const nextPage: number = this.showParts.length > (currentPage + 1) ? (currentPage + 1) : 0;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    const timeToDisplay = (this.showParts[currentPage].displayTime ?? this.defaultDisplayTime) * 1000;

    this.timer = setTimeout(() => {
      this.page = nextPage;
    },
      timeToDisplay);
  }
}
