import { Router } from '@angular/router';
import { DragAndDropService } from './../../_services/drag-and-drop.service';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ImageShow } from "../image-show.model";
import { ImageShowService } from "../image-show.service";
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: "app-show-list",
  templateUrl: "./show-list.component.html",
  styleUrls: ["./show-list.component.scss"],
})
export class ShowListComponent implements OnChanges {
  @Input()
  area: string;

  imageShows: ImageShow[];
  imageShow: ImageShow;

  uploadImageShow: boolean = false;

  loading: boolean = true;

  totalImagShows: number;

  loadRows: number = 10;

  constructor(
    private readonly imageShowService: ImageShowService,
    private readonly dragandDropService: DragAndDropService,
    private readonly router: Router,
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
    console.log(event);
    
    this.loading = true;
    const page = (event.first / event.rows);
    this.imageShowService.getImageShowPageByArea(this.area, event.rows, page, event.sortField, event.sortOrder == 1 ? 'asc':'desc').then((imageShowPage) => {
      this.totalImagShows = imageShowPage.page.totalElements;
      this.imageShows = imageShowPage.imageShows;
      this.loading = false;
    });
  }

  public editImageShow(imageShow: ImageShow){
    this.router.navigate(['imageshow', 'edit'], { queryParams: { imageShowRessource: imageShow.resourceUrl } });
  }

}
