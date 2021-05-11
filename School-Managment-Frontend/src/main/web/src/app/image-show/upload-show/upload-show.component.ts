import { AreaService } from 'src/app/area/area.service';
import { FileUpload } from 'primeng/fileupload';
import { ImageShow } from 'src/app/image-show/image-show.model';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ImageShowService } from '../image-show.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-upload-show',
  templateUrl: './upload-show.component.html',
  styleUrls: ['./upload-show.component.scss']
})
export class UploadShowComponent implements OnInit {

  imageShow: ImageShow = new ImageShow();

  errorMessage: string;
  uploading: boolean = false;
  displayDialogValue: boolean = false;

  @Output()
  uploadedImageShow = new EventEmitter<ImageShow>();

  @Output()
  displayDialogChange = new EventEmitter<boolean>();

  @Input()
  set displayDialog(val) {
    this.displayDialogValue = val;
    this.displayDialogChange.emit(this.displayDialog);
  }

  @ViewChild('fileUpload')
  fileUpload: FileUpload;

  @Input()
  area: string;

  areas: SelectItem[] = [];

  get displayDialog() {
    return this.displayDialogValue;
  }

  constructor(
    private readonly areaService: AreaService,
    private readonly imageShowService: ImageShowService,
  ) { }

  ngOnInit(): void {
    this.displayDialog = true;
    console.log(this.area);
    
    if (!this.area) {
      this.areaService.getUserAreas().then((areas: string[]) => {
        this.areas = areas.map(a => {
          return { label: a, value: a };
        });
      });
    } else {
      this.imageShow.area = this.area;
    }
  }

  close(): void {
    this.displayDialog = false;
    this.reset();
  }

  reset(): void {
    this.errorMessage = null;
    this.area = null;
    this.fileUpload.clear();
    this.imageShow = new ImageShow();
  }

  upload(): void {
    this.errorMessage = null;

    if (this.imageShow.area && this.fileUpload.files.length !== 0) {
      this.uploading = true;
      let doc;
      console.log(typeof doc);
      for (const file of this.fileUpload.files) {
        doc = file;
      }
      const formData = new FormData();
      formData.append('file', doc);
      formData.append('showName', this.imageShow.name);
      formData.append('area', this.imageShow.area);
      this.imageShowService.uploadImageShow(formData)
        .then((imageShow: ImageShow) => {
          this.uploadedImageShow.emit(imageShow);
          this.uploading = false;
          this.close();
        });
    } else {
      this.errorMessage = 'error.not-all-required-fields';
      return;
    }

  }

}
