import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UploadPhotoShowService } from './upload-photo-show.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-photo-show',
  templateUrl: './upload-photo-show.component.html',
  styleUrls: ['./upload-photo-show.component.css']
})
export class UploadPhotoShowComponent implements OnInit {

  uploadUrl: string;

  displayDialog: boolean;

  imageShow: ImageShow;

  selectedImageShow: ImageShow;

  newImageShow: boolean;

  imageShows: ImageShow[] = [];

  cols: any[];

  errorMessage: String;

  @ViewChild('fileUpload')
  fileUpload: FileUpload;

  showTypes;

  displayImages: boolean;

  imageShowParts: [] = [];


  constructor(
    private uploadService: UploadPhotoShowService,
  ) {

    this.showTypes = [
      { label: 'Advertisment', value: 'ADVERTISEMENT' },
      { label: 'Substitution', value: 'SUBSTITUTION' },
    ];

  }

  ngOnInit(): void {
    this.uploadService.getFiles().then(imageShowes => {
      this.imageShows = imageShowes
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'showType', header: 'Type' },
      { field: 'document', header: 'Document Name' },
    ];
  }

  onBeforeUpload(event) {
    event.formData.append("showName", this.imageShow.name);
    console.log("Sending File Upload to server!");
    return event;
  }

  showDialogToAdd() {
    this.newImageShow = true;
    this.imageShow = {};
    this.imageShow.date = new Date()
    this.displayDialog = true;
  }

  save() {
    let newImageShows = [...this.imageShows];
    this.errorMessage = null;
    if (this.imageShow.name && this.imageShow.showType && this.fileUpload.files.length != 0) {
      if (this.imageShow.showType == 'SUBSTITUTION' && this.imageShow.date) {

      }
      this.uploadUrl = this.imageShow.showType == 'SUBSTITUTION' ? environment.apiUrl + 'upload/substitution' : environment.apiUrl + 'upload/advertisment';
      this.fileUpload.url = this.uploadUrl;
      this.fileUpload.upload();
      newImageShows.push(this.imageShow);
    } else {
      this.errorMessage = "Not all required filds are present!";
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
    this.uploadService.delete(this.selectedImageShow.id);
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

  cloneShow(is: ImageShow): ImageShow {
    let imageShow = {};
    for (let prop in is) {
      imageShow[prop] = is[prop];
    }
    return imageShow;
  }


  showImages() {

    this.displayImages = !this.displayImages;
    this.uploadService.getImageShowParts(this.imageShow.id).then(showParts => {
      this.imageShowParts = showParts;
    })
  }
  getImage(showPart) {
    return 'data:image/JPEG;base64,' + showPart.image;
  }

}


class ImageShow {
  name?: String;
  showType?: String;
  file?;
  id?: number;
  document?: { fileName: String };
  date?: Date;
}
