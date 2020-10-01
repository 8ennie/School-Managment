import { ImageShowService } from './../image-show.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageShow } from './../image-show.model';
import { PhotoShowService } from './../photo-show.service';
import { AreaService } from './../area.service';
import { ImageShowStore } from './../image-show.store';
import { Component, OnInit } from '@angular/core';
import { TreeDragDropService, MessageService } from 'primeng/api';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-image-show',
  templateUrl: './edit-image-show.component.html',
  styleUrls: ['./edit-image-show.component.css'],
  providers: [TreeDragDropService]
})
export class EditImageShowComponent implements OnInit {

  loading: boolean;
  imageShow = new ImageShow;
  id;
  areas: { label: string, value: string }[];
  reset: boolean;

  constructor(
    private readonly areaService: AreaService,
    private readonly photoShowService: PhotoShowService,
    private readonly route: ActivatedRoute,
    private readonly imageShowService: ImageShowService,
    private readonly router: Router,
    private readonly imageShowStore: ImageShowStore,
    private readonly messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((parms: Params) => {
      this.id = parms['id'];
      this.loadImageShow();
    });
    this.loadImageShow();
    this.areaService.getUserAreas().then((areas: string[]) => {
      this.areas = areas.map(a => {
        return { label: a, value: a }
      });
    });
  }

  getImage(image) {
    return 'data:image/JPEG;base64,' + image;
  }

  removeShowPart(index) {
    this.imageShow.showParts.splice(index, 1);
  }

  loadImageShow() {
    this.imageShow = new ImageShow;
    if (this.id == 'new') {
      this.imageShow.showParts = [];
    } else {
      this.imageShowService.getImageShow(this.id).then(imageShow => {
        this.imageShow = imageShow;
        this.photoShowService.getShowShowParts(this.id).then((showParts: any) => {
          if (showParts) {
            this.imageShow.showParts = (showParts._embedded.imageShowShowParts).sort((n1, n2) => n1.position - n2.position);
          }
        });
      });
    }
  }

  onDrop(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.imageShow.showParts, event.previousIndex, event.currentIndex);
    } else {
      this.imageShow.showParts.push({ ...event.item.data, active: true });
      moveItemInArray(this.imageShow.showParts, (this.imageShow.showParts.length - 1), event.currentIndex);
    }
  }

  save() {
    console.log(this.imageShow);
    if (this.id != 'new') {
      let showParts = this.imageShow.showParts;
      this.imageShow.showParts = null;
      this.imageShowStore.updateImageShow(this.imageShow).then(() => {
        this.imageShowService.updateImageShowParts(this.id, showParts).then(
          () => {
            this.loadImageShow();
          }
        );
      });
    } else {
      console.log(this.imageShow);
      let showParts = this.imageShow.showParts;
      this.imageShow.showParts = null;
      this.imageShowStore.addImageShow(this.imageShow).then((imageShow: { _links }) => {
        let imageShowId = imageShow._links.self.href.split('/').pop();
        this.imageShowService.saveImageShowParts(imageShowId, showParts).then(
          () => {
            this.id = imageShowId;
            this.router.navigate(['photoshow', 'edit', imageShowId])
            this.loadImageShow();
          }
        );
      });
    }
  }

  showHide(showPart) {
    showPart.changed = true;
    showPart.active = !showPart.active;
  }

  onEditImageShow(id) {
    this.router.navigate(['photoshow', 'edit', id])
    this.id = id;
    this.loadImageShow();
  }

  delete() {
    this.imageShowService.deleteImageShow(this.id).then((res: { message }) => {
      if (res.message == 'SUCCSESS') {
        this.messageService.add({ severity: 'success', summary: 'Deleted Successfully!', detail: 'The Image Show was Deleted' });
        this.router.navigate(['photoshow', 'edit', 'new'])
        this.reset = true;
      } else if (res.message == 'IMAGE_SHOW_IN_USE') {
        this.messageService.add({ severity: 'error', summary: 'Delete Failed!', detail: 'A Monitor is Currently Using the Image Show' });
      }
    });
  }


}
