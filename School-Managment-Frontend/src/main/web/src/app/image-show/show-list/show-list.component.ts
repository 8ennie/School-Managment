import { ShowPart } from './../show-part/show-part.model';
import { EditShowPanelComponent } from './../edit-show-panel/edit-show-panel.component';
import { Router } from '@angular/router';
import { DragAndDropService } from './../../_services/drag-and-drop.service';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { ImageShow } from "../image-show.model";
import { ImageShowService } from "../image-show.service";
import { LazyLoadEvent } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';



@Component({
  selector: "app-show-list",
  templateUrl: "./show-list.component.html",
  styleUrls: ["./show-list.component.scss"],
})
export class ShowListComponent implements OnChanges {
  @Input()
  area: string;

  @Output()
  onUpdateImageShow = new EventEmitter<ImageShow>();

  imageShows: ImageShow[];
  imageShow: ImageShow;

  uploadImageShow: boolean = false;

  loading: boolean = true;

  totalImagShows: number;

  loadRows: number = 5;

  firstRow: number = 0;

  constructor(
    private readonly imageShowService: ImageShowService,
    private readonly dragandDropService: DragAndDropService,
    private readonly router: Router,
    private readonly dialogService: DialogService,
  ) { }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes.area) {
      this.loadImageShows({ rows: this.loadRows });
    }
  }

  public newShow(): void {
    this.uploadImageShow = true;
  }

  public dragStart(imageShow: ImageShow): void {
    this.dragandDropService.drag('imageShow', imageShow);
  }

  public onUploadedImageShow(imageShow: ImageShow): void {
    this.imageShows.push(imageShow);
  }

  public loadImageShows(event: LazyLoadEvent): void {
    this.loading = true;
    const page = (event.first / event.rows);
    this.imageShowService.getImageShowPageByArea(this.area, event.rows, page, event.sortField, event.sortOrder == 1 ? 'asc' : 'desc').then((imageShowPage) => {
      this.totalImagShows = imageShowPage.page.totalElements;
      this.imageShows = imageShowPage.imageShows;
      this.loading = false;
    });
  }

  public editImageShow(imageShow: ImageShow) {
    this.router.navigate(['imageshow', 'edit'], { queryParams: { imageShowRessource: imageShow.resourceUrl } });
  }

  public openPreview(showParts: ShowPart[], imageShow: ImageShow): void {
    const ref: DynamicDialogRef = this.dialogService.open(EditShowPanelComponent, {
      data: {
        imageShowResourceUrl: imageShow.resourceUrl,
        showParts: showParts,
        advanced: false,
      },
      width: '70%',
    });

    ref.onClose.subscribe((newImageShow: ImageShow) => {
      imageShow = newImageShow;
      this.updateImageShow(newImageShow);
    });
  }

  private updateImageShow(imageShow: ImageShow): void {
    for (let i = this.firstRow; i < this.firstRow + this.loadRows; i++) {
      if (this.imageShows[i].resourceUrl === imageShow.resourceUrl) {
        imageShow.imageCount = imageShow.showParts.length
        this.imageShows[i] = imageShow;
        break;
      }
    }
    this.imageShows = [...this.imageShows];

    this.onUpdateImageShow.emit(imageShow);
  }
}
