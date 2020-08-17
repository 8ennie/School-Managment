
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';
import { AdvertismentService } from './advertisment.service';

@Component({
  selector: 'app-advertisment',
  templateUrl: './advertisment.component.html',
  styleUrls: ['./advertisment.component.css']
})
export class AdvertismentComponent implements OnInit {

  displayDialog: boolean;

  imageShow: AdvertismentShow;

  selectedImageShow: AdvertismentShow;

  newImageShow: boolean;

  imageShows: AdvertismentShow[];

  errorMessage: string;

  @ViewChild('fileUpload')
  fileUpload: FileUpload;

  displayImages: boolean;

  imageShowParts: [] = [];


  constructor(
    private advertismentService: AdvertismentService,
  ) {
  }

  ngOnInit(): void {
    this.advertismentService.getAdvertisments().then(imageShowes => {
      this.imageShows = imageShowes
    });
  }

  showDialogToAdd() {
    this.newImageShow = true;
    this.imageShow = {};
    this.imageShow.showType = 'ADVERTISMENT';
    this.displayDialog = true;
  }

  save() {
    let newImageShows = [...this.imageShows];
    this.errorMessage = null;
    if (this.imageShow.name && this.imageShow.showType && this.fileUpload.files.length != 0) {
      let doc
      for (let file of this.fileUpload.files) {
        doc = file;
      }
      var formData = new FormData();
      formData.append("file", doc)
      formData.append("showName", this.imageShow.name);
      this.advertismentService.saveAdvertisment(formData).then(
        (subShow: AdvertismentShow) => {
          newImageShows.push(subShow);
          this.imageShows = newImageShows;
        });
    } else {
      this.errorMessage = "error.not-all-required-fields";
      return;
    }
    this.imageShows = newImageShows;
    this.close()
  }

  close() {
    this.imageShow = null;
    this.displayDialog = false;
  }

  delete() {
    this.advertismentService.deleteAdvertisment(this.selectedImageShow.id);
    let index = this.imageShows.indexOf(this.selectedImageShow);
    this.imageShows = this.imageShows.filter((val, i) => i != index);
    this.imageShow = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newImageShow = false;
    this.imageShow = this.cloneShow(event.data);
    console.log(this.imageShow);
    this.displayDialog = true;
  }

  cloneShow(is: AdvertismentShow): AdvertismentShow {
    let imageShow = {};
    for (let prop in is) {
      imageShow[prop] = is[prop];
    }
    return imageShow;
  }


  showImages() {
    this.displayImages = !this.displayImages;
    this.advertismentService.getImageShowParts(this.imageShow.id).then(showParts => {
      this.imageShowParts = showParts;
    })
  }
  getImage(showPart) {
    return 'data:image/JPEG;base64,' + showPart.image;
  }

  getDateStrin(date: Date): string {
    return date.toString()
  }
}


class AdvertismentShow {
  name?: string;
  showType?: string;
  file?;
  id?: number;
  document?: { fileName: string };
}