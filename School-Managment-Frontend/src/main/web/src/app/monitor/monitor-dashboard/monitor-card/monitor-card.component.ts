import { ConfirmationService } from 'primeng/api';
import { DragAndDropService } from './../../../_services/drag-and-drop.service';
import { MonitorService } from './../../monitor.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ImageShow } from "src/app/image-show/image-show.model";
import { Monitor } from "../../monitor.model";
import { ImageShowService } from 'src/app/image-show/image-show.service';

@Component({
  selector: "app-monitor-card",
  templateUrl: "./monitor-card.component.html",
  styleUrls: ["./monitor-card.component.scss"],
  providers: [ConfirmationService],
})
export class MonitorCardComponent implements OnInit, OnChanges {
  @Input()
  monitor: Monitor;

  @Input()
  area: string;

  imageShow: ImageShow;
  imageShows: ImageShow[];

  offline: boolean = true;
  loading: boolean = true;

  displayText: string;

  changeImageShowDialog: boolean = false;
  monitorOfflineNotification: boolean = false;
  constructor(
    private readonly monitorService: MonitorService,
    private readonly imageShowService: ImageShowService,
    private readonly dragandDropService: DragAndDropService,
    private readonly confirmationService: ConfirmationService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.monitor) {
      this.updateDisplay();
    }
  }

  ngOnInit(): void { }

  private updateDisplay(): void {
    this.loading = true;
    this.displayText = null;
    this.monitorService.pingMonitor(this.monitor).then((monitor: Monitor) => {
      console.log(monitor);
      
      this.loading = false;
      if (monitor.status == null) {
        this.displayText = "monitor.card.offline";
      } else {
        this.offline = false;
        if (!monitor.imageShow) {
          this.displayText = "monitor.card.no-show-loaded";
        }
        if (!monitor.currentUrl.includes('photoshow')) {
          this.displayText = monitor.currentUrl;
        }
      }
    });
  }

  public updateImageShow(): void {
    this.monitor.imageShow = this.imageShow;
    this.loading = true;
    this.updateMonitor();
    this.close();
  }

  public close(): void {
    this.imageShow = null;
    this.changeImageShowDialog = false;
  }

  public searchImageShows(event: { query: string }): void {
    this.imageShowService.getImageShowsByAreaAndNameContains(this.area, event.query).then((imageShows: ImageShow[]) => {
      this.imageShows = imageShows;
    });
  }

  public updateMonitor(): void {
    const oldMonitor = new Monitor();
    for (const prop in this.monitor) {
      oldMonitor[prop] = this.monitor[prop];
    }
    this.monitorService.loginAndStartShow(oldMonitor).then(() => {
      this.monitorService.updateMonitor(oldMonitor).then((monitor: Monitor) => {
        this.updateDisplay();
      });
    });
  }

  public onDrop(): void {
    const imageShow: ImageShow = this.dragandDropService.drop('imageShow');
    if (!this.offline) {
      this.confirmationService.confirm({
        message: ('Chaneg the Show on the Monitor [' + this.monitor.name + '] to Show [' + imageShow.name + ']'),
        header: ('Update Monitor'),
        icon: 'pi pi-desktop',
        accept: () => {
          this.monitor.imageShow = imageShow;
          this.loading = true;
          this.updateMonitor();
        },
        reject: () => {
          return;
        }
      });
    } else {
      this.monitorOfflineNotification = true;
    }
  }


}
