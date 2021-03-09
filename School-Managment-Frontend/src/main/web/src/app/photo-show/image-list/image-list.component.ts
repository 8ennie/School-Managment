
import { ImageShow } from './../image-show.model';
import { DocumentService } from './../document/document.service';
import { List } from 'immutable';
import { AreaService } from './../area.service';
import { PhotoShowService } from './../photo-show.service';
import { TreeNode, MessageService } from 'primeng/api';
import { ImageShowService } from './../image-show.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Document } from '../document/document.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  providers: [ConfirmationService]
})
export class ImageListComponent implements OnInit {

  constructor(
    private readonly photoShowService: PhotoShowService,
    private readonly imageShowService: ImageShowService,
    private readonly documentService: DocumentService,
    private readonly areaService: AreaService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) { }

  treeNodes: TreeNode[] = [];
  areas: string[];
  _uploadDocument = false;
  _uploadImageShow = false;
  editImageShows = false;

  set uploadDocument(uploadDocument: boolean) {
    if (!uploadDocument) {
      this.resetChildrenNodes(this.treeNodes[0]);
    }
    this._uploadDocument = uploadDocument;
  }

  get uploadDocument() {
    return this._uploadDocument;
  }


  set uploadImageShow(uploadImageShow: boolean) {
    if (!uploadImageShow) {
      this.resetChildrenNodes(this.treeNodes[1]);
    }
    this._uploadImageShow = uploadImageShow;
  }

  get uploadImageShow() {
    return this._uploadImageShow;
  }

  @Input()
  set reset(reset: boolean) {
    if (this.treeNodes[1]) {
      this.resetChildrenNodes(this.treeNodes[1]);
    }
  }


  @Output()
  showEdited = new EventEmitter<string>();

  ngOnInit(): void {

    this.treeNodes = [
      {
        label: 'documents',
        type: 'DOCUMENTS',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        leaf: false
      },
      {
        label: 'image-show-list',
        type: 'IMAGE_SHOWS',
        expandedIcon: 'pi pi-images',
        collapsedIcon: 'pi pi-images',
        leaf: false
      },
    ];
  }

  getImage(image) {
    return 'data:image/JPEG;base64,' + image;
  }

  loadAreas(parentNode: TreeNode) {
    if (!parentNode.children) {
      parentNode.children =
        [{
          type: parentNode.type + '_OPTIONS',
          leaf: true
        }];
    } else {
      if (parentNode.children) {
        parentNode.children.forEach(n => {
          if (!n.type.includes('SEARCH_') || !n.type.includes('OPTIONS_')) {
            n.children = null;
            n.expanded = false;
          }
        });
      }
    }
    if (this.areas == null) {
      this.areaService.getUserAreas().then((areas: string[]) => {
        this.areas = areas;
        this.loadAreas(parentNode);
      });
    } else {
      for (let i = 0; i < this.areas.length; i++) {
        const area = this.areas[i];
        const node = {
          label: area,
          type: parentNode.type + '_AREA',
          data: {
            area,
          },
          leaf: false
        };
        parentNode.children.push(node);
      }
      this.treeNodes = [...this.treeNodes];
    }
  }

  onNodeExpand(event) {
    const node = event.node;

    if (!node.children && node.type == 'DOCUMENTS') {
      this.loadAreas(node);
    }
    if (!node.children && node.type == 'DOCUMENTS_AREA') {
      this.loadDocumentsForArea(node);
    }
    if (!node.children && node.type == 'DOCUMENT') {
      this.loadImagesFromDocument(node);
    }
    if (!node.children && node.type == 'IMAGE_SHOWS') {
      this.loadAreas(node);
    }
    if (!node.children && node.type == 'IMAGE_SHOWS_AREA') {
      this.loadImageShowForArea(node);
    }
    if (!node.children && node.type == 'IMAGE_SHOW') {
      this.loadImagesFromImageShow(node);
    }
  }



  loadDocumentsForArea(parentNode) {
    this.documentService.getDocumentsByArea(parentNode.data.area).then(
      (res: { _embedded }) => {
        return List(res._embedded.documents);
      },
      err => console.log('Error retrieving ImageShowes')
    ).then((documents: List<Document>) => {
      for (let i = 0; i < documents.size; i++) {
        const document = documents.get(i);
        const node = {
          label: document.fileName,
          type: 'DOCUMENT',
          data: {
            id: document.id,
          },
          leaf: false
        };
        if (parentNode.children) {
          parentNode.children.push(node);
        } else {
          parentNode.children = [node];
        }
      }
      this.treeNodes = [...this.treeNodes];
    });
  }


  loadImageShowForArea(parentNode) {
    this.imageShowService.getImageShowByArea(parentNode.data.area).then(
      (res: { _embedded }) => {
        return List(res._embedded.imageShows);
      },
      err => console.log('Error retrieving ImageShowes')
    ).then((filterdImageShows: List<ImageShow>) => {
      for (let i = 0; i < filterdImageShows.size; i++) {
        const imageShow = filterdImageShows.get(i);
        const node = {
          label: imageShow.name,
          type: 'IMAGE_SHOW',
          data: {
            name: imageShow.name,
            area: imageShow.area,
            count: imageShow.imageCount,
            id: imageShow.id,
          },
          leaf: false
        };
        if (parentNode.children) {
          parentNode.children.push(node);
        } else {
          parentNode.children = [node];
        }
      }
      this.treeNodes = [...this.treeNodes];
    });
  }

  loadImagesFromImageShow(parentNode) {
    this.photoShowService.getShowShowParts(parentNode.data.id).then((showParts: any) => {
      if (showParts) {
        parentNode.children = [];
        for (let i = 0; i < showParts._embedded.imageShowShowParts.length; i++) {
          const showPart = showParts._embedded.imageShowShowParts[i];
          const node = {
            type: 'picture',
            data: {
              showPartImage: showPart.showPartImage,
              showPartId: showPart.showPartId,
              new: true
            },
            leaf: true
          };
          parentNode.children.push(node);
        }
      }
    });
  }

  loadImagesFromDocument(parentNode) {
    this.documentService.getImageShowParts(parentNode.data.id).then((showParts: { _embedded }) => {
      if (showParts) {
        parentNode.children = [];
        for (let i = 0; i < showParts._embedded.showParts.length; i++) {
          const showPart = showParts._embedded.showParts[i];
          const node = {
            type: 'picture',
            data: {
              showPartId: showPart.id,
              showPartImage: showPart.image,
              new: true
            },
            leaf: true
          };
          parentNode.children.push(node);
        }
      }
    });
  }

  editImageShow(node) {
    this.showEdited.emit(node.data.id);
  }

  deleteImageShow(node) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delte the Image Show?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.imageShowService.deleteImageShow(node.data.id).then((res: { message }) => {
          console.log(res);
          if (res.message == 'SUCCSESS') {
            this.messageService.add({ severity: 'success', summary: 'Deleted Successfully!', detail: 'The Image Show was Deleted' });
            node.parent.children = node.parent.children.filter(n => n != node);
          } else if (res.message == 'IMAGE_SHOW_IN_USE') {
            this.messageService.add({ severity: 'error', summary: 'Delete Failed!', detail: 'A Monitor is Currently Using the Image Show' });
          }
        });

      },
      reject: () => {
        return;
      }
    });
  }

  searchDocs(value: string) {
    this.loadAreas(this.treeNodes[0]);
    this.documentService.getDocumentsByFileNameContains(value).then(
      (res: { _embedded }) => {
        return List(res._embedded.documents);
      },
      err => console.log('Error retrieving Documents')
    ).then((documents: List<Document>) => {
      for (let i = 0; i < documents.size; i++) {
        const document = documents.get(i);
        const node = {
          label: document.fileName,
          type: 'DOCUMENT',
          data: {
            id: document.id,
          },
          leaf: false
        };
        const areaNode = this.treeNodes[0].children.filter(node => node.type == 'DOCUMENTS_AREA' && node.data.area == document.area)[0];
        if (areaNode) {
          if (areaNode.children) {
            areaNode.children.push(node);
          } else {
            areaNode.children = [node];
          }
        }

      }
      this.treeNodes[0].children = this.treeNodes[0].children.filter(n => n.children || n.type != 'DOCUMENTS_AREA');
      this.treeNodes = [...this.treeNodes];
    });
  }


  searchImageShows(value: string) {
    this.loadAreas(this.treeNodes[1]);
    this.imageShowService.getImageShowsByNameContains(value).then(
      (res: { _embedded }) => {
        return List(res._embedded.imageShows);
      },
      err => console.log('Error retrieving ImageShowes')
    ).then((imageShows: List<ImageShow>) => {
      for (let i = 0; i < imageShows.size; i++) {
        const imageShow = imageShows.get(i);
        const node = {
          label: imageShow.name,
          type: 'IMAGE_SHOW',
          data: {
            id: imageShow.id,
          },
          leaf: false
        };
        const areaNode = this.treeNodes[1].children.filter(n => n.type == 'IMAGE_SHOWS_AREA' && n.data.area == imageShow.area)[0];
        if (areaNode) {
          if (areaNode.children) {
            areaNode.children.push(node);
          } else {
            areaNode.children = [node];
          }
        }

      }
      this.treeNodes[1].children = this.treeNodes[1].children.filter(node => node.children || node.type != 'IMAGE_SHOWS_AREA');
      this.treeNodes = [...this.treeNodes];
    });
  }

  resetChildrenNodes(node: TreeNode) {
    node.children = null;
    this.loadAreas(node);
    this.editImageShows = false;
  }

  search(node: TreeNode) {
    if (!node.children[1].type.includes('SEARCH_')) {
      node.children.splice(1, 0, {
        label: 'search',
        type: 'SEARCH_' + node.type,
        leaf: true
      });
    }
  }

  returnFalse(){
    return false;
  }

}
