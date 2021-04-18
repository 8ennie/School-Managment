import { MonitorService } from "./../../monitor/monitor.service";
import { Monitor } from "src/app/monitor/monitor.model";
import { ShowPart } from "./../show-part/show-part.model";
import { ShowPartService } from "./../show-part/show-part.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AreaService } from "src/app/area/area.service";
import { ImageShow } from "src/app/image-show/image-show.model";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { SelectItem } from "primeng/api";
import { ImageShowService } from "../image-show.service";

@Component({
  selector: "app-edit-show-panel",
  templateUrl: "./edit-show-panel.component.html",
  styleUrls: ["./edit-show-panel.component.scss"],
})
export class EditShowPanelComponent implements OnInit, OnChanges {
  imageShow: ImageShow = new ImageShow();
  areas: SelectItem[];

  monitorUsingShow: Monitor[];
  updateMonitors: boolean = false;

  @Input()
  imageShowResourceUrl: string;

  @Output()
  imageShowSaved: EventEmitter<ImageShow> = new EventEmitter<ImageShow>();

  constructor(
    private readonly areaService: AreaService,
    private readonly imageShowService: ImageShowService,
    private readonly showPartService: ShowPartService,
    private readonly monitorService: MonitorService
  ) {}

  ngOnInit(): void {
    this.imageShow.showParts = [];
    this.areaService.getUserAreas().then((areas: string[]) => {
      this.areas = areas.map((a) => {
        return { label: a, value: a };
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageShowResourceUrl) {
      if (this.imageShowResourceUrl) {
        this.imageShowService
          .getImageShow(this.imageShowResourceUrl)
          .then((imageShow: ImageShow) => {
            this.imageShow = imageShow;
            this.showPartService
              .getShowPartsFromImageShow(imageShow.resourceUrl)
              .then((showParts: ShowPart[]) => {
                if (showParts) {
                  this.imageShow.showParts = showParts.sort(
                    (n1, n2) => n1.position - n2.position
                  );
                }
              });
          });
      } else {
        this.imageShow = new ImageShow();
      }
    }
  }

  public onDrop(event: CdkDragDrop<ShowPart>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.imageShow.showParts as string[],
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (this.imageShow.showParts) {
        this.imageShow.showParts.push({ ...event.item.data, active: true });
        moveItemInArray(
          this.imageShow.showParts as string[],
          this.imageShow.showParts.length - 1,
          event.currentIndex
        );
      } else {
        this.imageShow.showParts = [{ ...event.item.data, active: true }];
      }
    }
  }

  public getImage(image: string) {
    return "data:image/JPEG;base64," + image;
  }

  public removeShowPart(index: number): void {
    this.imageShow.showParts.splice(index, 1);
  }

  public setShowPartActive(showPart: ShowPart, status: boolean): void {
    showPart.changed = true;
    showPart.active = status;
  }

  delete() {}

  public save(): void {
    if (this.imageShowResourceUrl) {
      const showParts = this.imageShow.showParts;
      this.imageShow.showParts = null;
      this.imageShowService
        .updateImageShow(this.imageShow)
        .then((imageShow: ImageShow) => {
          this.showPartService
            .updateShowPartsForImageShow(
              showParts as ShowPart[],
              imageShow.resourceUrl
            )
            .then((_) => {
              this.imageShow = imageShow;
              this.imageShow.showParts = showParts;
            });
        });
      if (this.monitorUsingShow.length > 0 && this.updateMonitors) {
        this.monitorUsingShow.forEach((monitor) => {
          this.monitorService.loginAndStartShow(monitor);
        });
      }
    } else {
      const showParts = this.imageShow.showParts;
      this.imageShow.showParts = null;
      this.imageShowService
        .saveImageShow(this.imageShow)
        .then((imageShow: ImageShow) => {
          this.showPartService
            .saveShowPartsForImageShow(
              showParts as ShowPart[],
              imageShow.resourceUrl
            )
            .then((_) => {
              this.imageShow = imageShow;
              this.imageShowResourceUrl = imageShow.resourceUrl;
              this.imageShow.showParts = showParts;
              this.imageShowSaved.emit(this.imageShow);
            });
        });
    }
  }
}
