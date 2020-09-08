import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';
import { SubstitutionService } from './substitution.service';
import { MonitorService } from '../monitor/monitor.service';

@Component({
  selector: 'app-substitution',
  templateUrl: './substitution.component.html',
  styleUrls: ['./substitution.component.css']
})
export class SubstitutionComponent implements OnInit {

  uploadUrl: string = environment.apiUrl + 'upload/substitution';

  displayDialog: boolean;

  imageShow: SubstitutionShow;

  selectedImageShow: SubstitutionShow;

  newImageShow: boolean;

  imageShows: SubstitutionShow[] = [];

  errorMessage: string;

  @ViewChild('fileUpload')
  fileUpload: FileUpload;

  displayImages: boolean;

  imageShowParts: [] = [];

  updateSubMonitor:boolean = true;


  constructor(
    private substitutionService: SubstitutionService,
    private monitorService: MonitorService,
  ) {


  }

  ngOnInit(): void {
    this.substitutionService.getSubsitutions().then(imageShowes => {
      this.imageShows = imageShowes
    });
  }

  showDialogToAdd() {
    this.errorMessage = ""
    this.newImageShow = true;
    this.imageShow = {};
    this.imageShow.showType = 'SUBSTITUTION';
    this.imageShow.date = new Date()
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
      formData.append("date", this.imageShow.date.toString());
      formData.append("showName", this.imageShow.name);
      this.substitutionService.saveSubstitution(formData).then(
        (subShow: SubstitutionShow) => {
          newImageShows.push(subShow);
          this.imageShows = newImageShows;

          this.monitorService.getAllMonitors().then(
            (monitors) => {
              monitors.forEach(monitor => {
                if(monitor.area == 'SUBSTITUTION'){
                  this.monitorService.loginAndShowSubstitution(monitor);
                }
              });
            }
          )


        }
      );
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
    this.substitutionService.delete(this.selectedImageShow.id);
    let index = this.imageShows.indexOf(this.selectedImageShow);
    this.imageShows = this.imageShows.filter((val, i) => i != index);
    this.imageShow = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.errorMessage = ""
    this.newImageShow = false;
    this.imageShow = this.cloneShow(event.data);
    this.imageShow.date = new Date(this.imageShow.date)
    this.displayDialog = true;
  }

  cloneShow(is: SubstitutionShow): SubstitutionShow {
    let imageShow = {};
    for (let prop in is) {
      imageShow[prop] = is[prop];
    }
    return imageShow;
  }


  showImages() {
    this.displayImages = !this.displayImages;
    this.substitutionService.getImageShowParts(this.imageShow.id).then(showParts => {
      this.imageShowParts = showParts;
    })

  }
  getImage(showPart) {
    return 'data:image/JPEG;base64,' + showPart.image;
  }

  getDateString(date:Date):string{
    if(date.toString().length > 10){
      return date.toString().substring(0,10);
    }
    return date.toString()
  }
}


class SubstitutionShow {
  name?: string;
  showType?: string;
  file?;
  id?: number;
  date?: Date;
}