import { DocumentService } from './../../document/document.service';

import { MonitorService } from "./../../monitor/monitor.service";
import { Monitor } from "src/app/monitor/monitor.model";
import { ShowPart } from "./../show-part/show-part.model";
import { ShowPartService } from "./../show-part/show-part.service";
import { CdkDragDrop, CDK_DRAG_CONFIG, moveItemInArray } from "@angular/cdk/drag-drop";
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
import { MessageService, SelectItem } from "primeng/api";
import { ImageShowService } from "../image-show.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 2000
};

@Component({
  selector: "app-edit-show-panel",
  templateUrl: "./edit-show-panel.component.html",
  styleUrls: ["./edit-show-panel.component.scss"],
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: DragConfig }]
})
export class EditShowPanelComponent implements OnInit, OnChanges {
  imageShow: ImageShow = new ImageShow();
  areas: SelectItem[];

  monitorUsingShow: Monitor[];
  updateMonitors: boolean = false;

  uploadDocument = false;

  displayTime = 12;

  displayTimeOptions = [{ label: 'edit-show-panel.individual', value: true }, { label: 'edit-show-panel.shared', value: false }];

  @Input()
  advanced: boolean = true;

  @Input()
  imageShowResourceUrl: string;

  @Output()
  imageShowSaved: EventEmitter<ImageShow> = new EventEmitter<ImageShow>();

  @Output()
  imageShowDeleted: EventEmitter<ImageShow> = new EventEmitter<ImageShow>();

  constructor(
    private readonly areaService: AreaService,
    private readonly imageShowService: ImageShowService,
    private readonly showPartService: ShowPartService,
    private readonly monitorService: MonitorService,
    private readonly messageService: MessageService,


    private readonly config: DynamicDialogConfig,
    private readonly ref: DynamicDialogRef,
  ) {
    this.imageShowResourceUrl = config?.data?.imageShowResourceUrl;
    this.advanced = config?.data?.advanced;
  }

  ngOnInit(): void {
    this.imageShow.showParts = [];
    this.areaService.getUserAreas().then((areas: string[]) => {
      this.areas = areas.map((a) => {
        return { label: a, value: a };
      });
    });
    if (this.imageShowResourceUrl) {
      this.loadImageShow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageShowResourceUrl) {
      if (this.imageShowResourceUrl) {
        this.loadImageShow();
      } else {
        this.imageShow = new ImageShow();
        this.imageShow.individualDisplayTimes = false;
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
        this.imageShow.showParts.push({ ...event.item.data, active: true, displayTime: this.displayTime });
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

  public delete(): void {
    this.imageShowService.deleteImageShow(this.imageShow).then(m => {
      if (m.message == "IMAGE_SHOW_IN_USE") {
        this.messageService.add({ severity: 'error', summary: 'Delete Failed!', detail: 'A Monitor is Currently Using the Image Show' });
      } if (m.message == "SUCCSESS") {
        this.imageShowDeleted.emit(this.imageShow);
        this.imageShow = new ImageShow();
        this.imageShow.showParts = [];
      }
    });
  }

  public save(): void {
    if (!this.imageShow.individualDisplayTimes) {
      this.imageShow.showParts.forEach((showPart) => {
        showPart.displayTime = this.displayTime;
      });
    }

    const showParts = this.imageShow.showParts;
    this.imageShow.showParts = null;


    if (this.imageShowResourceUrl) {
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
              if (this.ref) {
                this.ref.close(this.imageShow);
              }
            });
        });
      if (this.monitorUsingShow.length > 0 && this.updateMonitors) {
        this.monitorUsingShow.forEach((monitor) => {
          this.monitorService.loginAndStartShow(monitor);
        });
      }
    } else {
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

  public insertDocument(showParts: ShowPart[]): void {
    showParts.forEach((showPart: ShowPart) => {
      showPart.displayTime = this.displayTime;
      (this.imageShow.showParts as ShowPart[]).push(showPart);
    });

  }

  private loadImageShow(): void {
    this.imageShowService
      .getImageShow(this.imageShowResourceUrl)
      .then((imageShow: ImageShow) => {
        this.imageShow = imageShow;
        this.imageShow.individualDisplayTimes = this.imageShow.individualDisplayTimes ?? false;
        this.showPartService
          .getShowPartsFromImageShow(imageShow.resourceUrl)
          .then((showParts: ShowPart[]) => {
            if (showParts) {
              this.imageShow.showParts = showParts.sort(
                (n1, n2) => n1.position - n2.position
              );
              if (!this.imageShow.individualDisplayTimes) {
                this.displayTime = showParts[0].displayTime ?? 10;
              }
            }
            if (this.config?.data?.showParts) {
              this.config.data.showParts.forEach((showPart: ShowPart) => {
                showPart.displayTime = this.displayTime;
                (this.imageShow.showParts as ShowPart[]).push(showPart);
              });
            }
            this.monitorService.getAllActiveMonitors().then((monitors: Monitor[]) => {
              this.monitorUsingShow = monitors.filter(m => m.imageShowUrl == this.imageShowResourceUrl);
              if (this.monitorUsingShow.length > 0) {
                this.updateMonitors = true;
              }
            });
          });
      });
  }
}
