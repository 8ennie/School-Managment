import { ImageShowStore } from './../../image-show.store';
import { ImageShowService } from './../../image-show.service';
import { ImageShow } from './../../image-show.model';
import { AreaService } from './../../area.service';
import { FileUpload } from 'primeng/fileupload';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-image-show',
  templateUrl: './upload-image-show.component.html',
  styleUrls: ['./upload-image-show.component.css']
})
export class UploadImageShowComponent implements OnInit {


  imageShow: ImageShow = new ImageShow();

  errorMessage: string;
  displayDialogValue = false;
  uploading = false;

  @Output() displayDialogChange = new EventEmitter<boolean>();

  @Input()
  set displayDialog(val) {
    this.displayDialogValue = val;
    this.displayDialogChange.emit(this.displayDialog);
  }

  get displayDialog() {
    return this.displayDialogValue;
  }

  @ViewChild('fileUpload')
  fileUpload: FileUpload;

  @Input()
  area: string;

  areas = [];

  constructor(
    private readonly imageShowStore: ImageShowStore,
    private readonly areaService: AreaService,
  ) { }

  ngOnInit(): void {
    if (!this.area) {
      this.areaService.getUserAreas().then((areas: string[]) => {
        this.areas = areas.map(a => {
          return { label: a, value: a }
        });
      });
    } else {
      this.imageShow.area = this.area;
    }
  }

  close() {
    this.displayDialog = false;
    this.reset();
  }

  reset() {
    this.errorMessage = null;
    this.area = null;
    this.fileUpload.clear();
    this.imageShow = new ImageShow();
  }

  save() {
    this.errorMessage = null;

    if (this.imageShow.area && this.fileUpload.files.length != 0) {
      this.uploading = true;
      let doc
      for (let file of this.fileUpload.files) {
        doc = file;
      }
      var formData = new FormData();
      formData.append("file", doc);
      formData.append("showName", this.imageShow.name);
      formData.append("area", this.imageShow.area);
      this.imageShowStore.addImageShow2(formData).then(() => {
        this.uploading = false;
        this.close();
      }
      );
    } else {
      this.errorMessage = "error.not-all-required-fields";
      return;
    }

  }
}
