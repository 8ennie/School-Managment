import { Monitor } from './../../monitor/monitor.model';
import { AuthUser } from './../../auth/auth-user.model';
import { PublicTransport, TransportCpmponentConfiguration } from './../../addons/public-transport/public-transport.model';
import { AuthService } from './../../auth/auth.service';
import { MonitorService } from './../../monitor/monitor.service';
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HeaderService } from "src/app/header/header.service";
import { ImageShow } from "../image-show.model";
import { ImageShowService } from "../image-show.service";
import { ShowPart, ShowPartType } from "../show-part/show-part.model";
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

  showParts: (ShowPart | { showPartType: ShowPartType, displayTime: number, page: number })[] = [];

  public page: number = 0;

  private publicTransport: PublicTransport;

  private publicTransportShowing = false;

  public transportCpmponentConfiguration?: TransportCpmponentConfiguration;

  private timer;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly imageShowService: ImageShowService,
    private readonly showPartService: ShowPartService,
    private readonly headerService: HeaderService,
    private readonly authService: AuthService,
    private readonly monitorService: MonitorService,
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

    const user: AuthUser = this.authService.getUser();
    if (user.username.includes('Monitor')) {
      this.monitorService.getMonitorForUser(user.id).then((monitor: Monitor[]) => {
        if (monitor.length > 0) {
          this.publicTransport = monitor[0].publicTransportShowPart;
          if (this.publicTransport.showPublicTransport) {
            this.setUpTimer();
          }
        }
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


  private setUpTimer(): void {
    setInterval(this.checkTime.bind(this), 3000);
  }


  private checkTime(): void {
    const now = new Date();
    const pastStart = (this.publicTransport.startTime.getHours() * 60) + this.publicTransport.startTime.getMinutes() < (now.getHours() * 60) + now.getMinutes();;
    const beforEnd = (this.publicTransport.endTime.getHours() * 60) + this.publicTransport.endTime.getMinutes() > (now.getHours() * 60) + now.getMinutes();;
    if (pastStart && beforEnd && !this.publicTransportShowing) {
      if (this.transportCpmponentConfiguration) {
        for (let i = 0; i < Math.ceil(this.transportCpmponentConfiguration.total / this.transportCpmponentConfiguration.showOnPage); i++) {
          this.showParts.push({ showPartType: ShowPartType.PUBLIC_TARNSPORT, displayTime: 6, page: i + 1 });
          this.showParts = [...this.showParts];
        }
        if (this.showParts.length - Math.ceil(this.transportCpmponentConfiguration.total / this.transportCpmponentConfiguration.showOnPage) === 1) {
          this.pageChanged({ page: 0 });
        }
        this.publicTransportShowing = true;
      }
    }
    if (!pastStart || !beforEnd && this.publicTransportShowing) {
      for (let i = 0; i < Math.ceil(this.transportCpmponentConfiguration.total / this.transportCpmponentConfiguration.showOnPage); i++) {
        this.showParts.pop();
        this.showParts = [...this.showParts];
      }
      this.publicTransportShowing = false;
    }
  }
}
