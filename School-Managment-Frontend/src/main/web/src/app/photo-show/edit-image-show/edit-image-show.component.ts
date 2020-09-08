import { ActivatedRoute, Params } from '@angular/router';
import { ImageShow } from './../image-show.model';
import { PhotoShowService } from './../photo-show.service';
import { AreaService } from './../area.service';
import { ImageShowStore } from './../image-show.store';
import { Component, OnInit } from '@angular/core';
import { TreeNode, MenuItem } from 'primeng/api';
import { DocumentStore } from '../document/document.store';
import { TreeDragDropService } from 'primeng/api';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-image-show',
  templateUrl: './edit-image-show.component.html',
  styleUrls: ['./edit-image-show.component.css'],
  providers: [TreeDragDropService]
})
export class EditImageShowComponent implements OnInit {


  imageShowParts: TreeNode[] = [];
  loading: boolean;
  imageShow: ImageShow = new ImageShow;
  id;
  areas;

  constructor(
    private readonly imageShowStore: ImageShowStore,
    private readonly areaService: AreaService,
    private readonly photoShowService: PhotoShowService,
    private readonly documentStore: DocumentStore,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {



    this.route.params.subscribe((parms: Params) => {
      this.id = parms['id'];
    });

    if (this.id == 'new') {
      this.imageShow.showParts = [];
    } else {
      console.log("Loading image Show Parts");
      this.imageShowStore.get(this.id).then(imageShow => {
        this.imageShow = imageShow;
        this.photoShowService.getShowShowParts(this.id).then((showParts: any) => {
          console.log(showParts);
          if (showParts) {
            this.imageShow.showParts = showParts._embedded.imageShowShowParts;
            console.log(this.imageShow);

          }
        });
      });

    }

    this.areaService.getAllAreas().then((areas: string[]) => {
      this.areas = areas.map(a => {
        return { label: a, value: a }
      });
    });

    this.imageShowParts = [
      {
        "label": "Documents",
        "data": { type: 'DOCUMENTS' },
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "leaf": false
      },
      {
        "label": "Image Shows",
        "data": { type: 'IMAGE_SHOWS' },
        "expandedIcon": "pi pi-images",
        "collapsedIcon": "pi pi-images",
        "leaf": false
      },
    ];
    this.documentStore.documents.subscribe(documents => {
      this.loading = true;
      for (let i = 0; i < documents.size; i++) {
        let document = documents.get(i);
        let node = {
          label: document.fileName,
          data: {
            type: 'DOCUMENT',
            id: document.id,
          },
          leaf: false
        };
        let docNode = this.imageShowParts[0];
        if (docNode.children) {
          docNode.children.push(node);
        } else {
          docNode.children = [node];
        }
      }
      this.imageShowParts = [...this.imageShowParts];
      this.loading = false;
    });
    this.imageShowStore.imageShowsFiltered.subscribe(filterdImageShows => {
      this.loading = true;
      for (let i = 0; i < filterdImageShows.size; i++) {
        let imageShow = filterdImageShows.get(i);
        let node = {
          label: imageShow.name,
          data: {
            name: imageShow.name,
            area: imageShow.area,
            count: imageShow.imageCount,
            type: 'SHOW',
            id: imageShow.id,
          },
          leaf: false
        };
        let areaNode = this.imageShowParts[1].children.filter(n => n.data.area == node.data.area)[0];
        if (areaNode.children) {
          areaNode.children.push(node);
        } else {
          areaNode.children = [node];
        }
      }
      this.imageShowParts = [...this.imageShowParts];
      this.loading = false;
    });
  }

  addShowPart() {
    if (this.imageShow.showParts) {
      this.imageShow.showParts.push({ id: this.selectedNode.data.id });
    }
  }

  viewShowPart() {

  }

  loadImageShowParts(parentNode) {
    this.photoShowService.getShowShowParts(parentNode.data.id).then((showParts: any) => {
      if (showParts) {
        parentNode.children = [];
        for (let i = 0; i < showParts._embedded.imageShowShowParts.length; i++) {
          let showPart = showParts._embedded.imageShowShowParts[i];
          let node = {
            type: 'picture',
            data: {
              showPartImage: showPart.showPartImage,
              id: showPart.showPartId,
              new: true
            },
            leaf: true
          };
          parentNode.children.push(node);
        }
      }
    });
  }

  loadShowParts(parentNode) {
    this.documentStore.getImageShowParts(parentNode.data.id).then((showParts: { _embedded }) => {
      if (showParts) {
        parentNode.children = [];
        for (let i = 0; i < showParts._embedded.showParts.length; i++) {
          let showPart = showParts._embedded.showParts[i];
          let node = {
            type: 'picture',
            data: {
              id: showPart.id,
              showPartImage: showPart.image,
              new: true
            },
            leaf: true
          };
          parentNode.children.push(node);
        }
      }
    });;
  }

  loadAreas(imageShowNode) {
    imageShowNode.children = [];
    this.loading = true;
    for (let i = 0; i < this.areas.length; i++) {
      let area = this.areas[i].value;
      let node = {
        label: area,
        data: {
          area: area,
          type: 'AREA'
        },
        leaf: false
      };
      imageShowNode.children.push(node);
    }
    this.imageShowParts = [...this.imageShowParts];
    this.loading = false;
  }

  onNodeExpand(event) {
    let node = event.node;
    if (!node.children && node.data.type == 'IMAGE_SHOWS') {
      this.loadAreas(node);
    }
    if (!node.children && node.data.type == 'AREA') {
      this.imageShowStore.filterForArea(node.data.area);
    }
    if (!node.children && node.data.type == 'SHOW') {
      this.loadImageShowParts(node);
    }
    if (node.data.type == 'DOCUMENT' && !node.children) {
      this.loadShowParts(node);
    }
  }

  getImage(image) {
    return 'data:image/JPEG;base64,' + image;
  }

  draggedNode: TreeNode;
  selectedNode;

  nodeSelect(event) {
    let node = event.node;
    if (node.data.type == 'DOC') {
      if (node.data.loaded == null) {
        this.documentStore.getImageShowParts(node.data.id).then((showParts: any) => {
          this.loadShowParts(node);
          node.data.loaded = true;
        });;
      }
    }
    if (node.data.type == 'SHOW') {
      if (node.data.loaded == null) {
        this.loadImageShowParts(node);
        node.data.loaded = true;
      }
    }
  }

  removeShowPart(index) {
    this.imageShow.showParts.splice(index, 1);
  }

  onDrop(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.imageShow.showParts, event.previousIndex, event.currentIndex);
    } else {
      this.imageShow.showParts.push({ ...event.item.data, active: true });
      moveItemInArray(this.imageShow.showParts, (this.imageShow.showParts.length - 1), event.currentIndex);
    }
  }

  noReturnPredicate() {
    return false;
  }

  save() {
    console.log(this.imageShow);
    if (this.id != 'new') {
      this.imageShow.showParts.forEach(element => {

      });
    } else {
      console.log(this.imageShow);
      let showParts = this.imageShow.showParts;
      this.imageShow.showParts = null;
      this.imageShowStore.addImageShow(this.imageShow).then(imageShow => {
        
      });
    }

  }

  showHide(showPart) {
    showPart.changed = true;
    showPart.active = !showPart.active;
  }

}
