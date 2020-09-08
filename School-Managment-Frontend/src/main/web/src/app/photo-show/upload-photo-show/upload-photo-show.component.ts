
import { ImageShowStore } from './../image-show.store';
import { FileUpload } from 'primeng/fileupload';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AreaService } from '../area.service';
import { ImageShowService } from '../image-show.service';
import { ImageShow } from '../image-show.model';

@Component({
  selector: 'app-upload-photo-show',
  providers: [],
  templateUrl: './upload-photo-show.component.html',
  styleUrls: ['./upload-photo-show.component.css']
})
export class UploadPhotoShowComponent implements OnInit {

  imageShows: ImageShow[];

  selectedImageShow;

  imageShow;
  newImageShow = true;
  rowGroupMetadata: any;

  createImageShow = true;
  errorMessage: string;
  displayImages = false;
  displayDialog = false;

  @ViewChild('fileUpload')
  fileUpload: FileUpload;
  areas = [];
  load = true;

  currentAreas = [];
  filterArea = [];
  constructor(
    private imageShowStore: ImageShowStore,
    private areaService: AreaService,
  ) {

  }

  ngOnInit(): void {
    this.imageShowStore.imageShows.subscribe(imageShows => {
      if (imageShows.size > 0) {
        this.load = false;
        this.imageShows = null;
        this.imageShows = imageShows.toArray();
        this.updateRowGroupMetaData();
        this.load = true;
      }
    });

    this.areaService.getAllAreas().then((areas: string[]) => {
      this.areas = areas.map(a => {
        return { label: a, value: a }
      });
    });
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    this.currentAreas = [];
    if (this.imageShows) {
      for (let i = 0; i < this.imageShows.length; i++) {
        let rowData = this.imageShows[i];
        let area = rowData.area;
        if (this.currentAreas.filter(a => a.value == area).length == 0) {
          this.currentAreas.push({ label: area, value: area });
        }
        if (i == 0) {
          this.rowGroupMetadata[area] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.imageShows[i - 1];
          let previousRowGroup = previousRowData.area;
          if (area === previousRowGroup)
            this.rowGroupMetadata[area].size++;
          else
            this.rowGroupMetadata[area] = { index: i, size: 1 };
        }
      }
    }
  }



  showDialogToAdd() {
    this.newImageShow = true;
    this.imageShow = new ImageShow();
    this.displayDialog = true;
  }

  onRowSelect(event) {
    this.errorMessage = ""
    this.newImageShow = false;
    this.imageShow = this.cloneShow(event.data);
    this.imageShow.date = new Date(this.imageShow.date)
    this.displayDialog = true;
  }

  cloneShow(is: ImageShow): ImageShow {
    let imageShow = {};
    for (let prop in is) {
      imageShow[prop] = is[prop];
    }
    return imageShow;
  }


  showImages() {

  }


  save() {
    let newImageShows;
    if (this.imageShows) {
      newImageShows = [...this.imageShows];
    } else {
      newImageShows = [];
    }
    this.errorMessage = null;
    if (this.newImageShow) {
      if (this.imageShow.name && this.imageShow.area && this.fileUpload.files.length != 0) {
        let doc
        for (let file of this.fileUpload.files) {
          doc = file;
        }
        var formData = new FormData();
        formData.append("file", doc)
        formData.append("showName", this.imageShow.name);
        formData.append("area", this.imageShow.area);
        this.imageShowStore.addImageShow2(formData);
      } else {
        this.errorMessage = "error.not-all-required-fields";
        return;
      }
      this.imageShows = newImageShows;
      this.close();
    } else {
      if (this.imageShow.name && this.imageShow.area && this.imageShow.id) {
        var changedImageShow = new ImageShow();
        changedImageShow.id = this.imageShow.id;
        changedImageShow.name = this.imageShow.name;
        changedImageShow.area = this.imageShow.area;
        this.imageShowStore.updateImageShow(changedImageShow);
      } else {
        this.errorMessage = "error.not-all-required-fields";
        return;
      }
      this.imageShows = newImageShows;
      this.close();
    }

  }

  close() {
    this.imageShow = null;
    this.displayDialog = false;
  }

  delete() {
    this.imageShowStore.deleteImageShow(this.imageShow);
    this.close();
  }
}

