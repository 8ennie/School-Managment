import { AreaService } from './../../area.service';
import { DocumentService } from './../document.service';
import { FileUpload } from 'primeng/fileupload';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {

  document: Document = new Document();
  errorMessage: string;
  displayDialogValue = false;
  @Output() displayDialogChange = new EventEmitter<boolean>();

  @Input()
  set displayDialog(val) {
    this.displayDialogValue = val;
    this.displayDialogChange.emit(this.displayDialog);
  }

  get displayDialog(){
    return this.displayDialogValue;
  }

  @ViewChild('fileUpload')
  fileUpload: FileUpload;
  areas = [];

  constructor(
    private readonly documentService: DocumentService,
    private areaService: AreaService,
  ) { }

  ngOnInit(): void {
    this.areaService.getUserAreas().then((areas: string[]) => {
      this.areas = areas.map(a => {
        return { label: a, value: a }
      });
    });
  }

  close() {
    this.displayDialog = false;
  }

  save() {
    this.errorMessage = null;

    if (this.document.area && this.fileUpload.files.length != 0) {
      let doc
      for (let file of this.fileUpload.files) {
        doc = file;
      }
      var formData = new FormData();
      formData.append("file", doc)
      formData.append("area", this.document.area);
      this.documentService.uploadDocument(formData);
    } else {
      this.errorMessage = "error.not-all-required-fields";
      return;
    }
    this.close();

  }

}
