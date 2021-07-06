import { Image } from './../image/image.model';
import { ImageService } from './../image/image.service';
import { ShowPart } from './../show-part/show-part.model';
import { ShowPartService } from './../show-part/show-part.service';

import { ImageShow } from '../image-show.model';
import { AreaService } from '../../area/area.service';

import { TreeNode, MessageService } from 'primeng/api';
import { ImageShowService } from '../image-show.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Document } from 'src/app/document/document.model';
import { DocumentService } from 'src/app/document/document.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  providers: [ConfirmationService]
})
export class ImageListComponent implements OnInit {

  constructor(
    private readonly showPartService: ShowPartService,
    private readonly imageService: ImageService,
    private readonly imageShowService: ImageShowService,
    private readonly documentService: DocumentService,
    private readonly areaService: AreaService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) { }

  treeNodes: TreeNode[] = [];
  areas: string[];
  _uploadDocument: boolean = false;
  _uploadImageShow: boolean = false;

  filteredImageShows: ImageShow[];
  filteredDocuments: Document[];

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
  onImageShowEdited = new EventEmitter<string>();

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

  public getImage(image: string) {
    return 'data:image/JPEG;base64,' + image;
  }

  private loadAreas(parentNode: TreeNode) {
    if (this.areas == null) {
      this.areaService.getUserAreas().then((areas: string[]) => {
        this.areas = areas;
        this.loadAreas(parentNode);
      });
    } else {
      const areaNodes: TreeNode[] = this.areas.map((area: string): TreeNode => {
        return {
          label: area,
          type: parentNode.type + '_AREA',
          data: {
            area,
          },
          leaf: false
        }
      });
      const searchNode: TreeNode = parentNode.children ? parentNode.children[0] : null;
      parentNode.children = searchNode ? [searchNode, ...areaNodes] : [...areaNodes];
    }
  }

  public onNodeExpand(event: { node: TreeNode }): void {
    const node: TreeNode = event.node;
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
      this.loadShowPartsFromImageShow(node);
    }
    if (!node.children) {
      node.leaf = true;
    }
    node.expanded = !node.expanded;
  }


  private loadDocumentsForArea(parentNode: TreeNode): void {
    this.documentService.getDocumentsByArea(parentNode.data.area)
      .then((documents: Document[]) => {
        parentNode.children = documents.map((document: Document): TreeNode => {
          return {
            label: document.fileName,
            type: 'DOCUMENT',
            data: {
              resourceUrl: document.resourceUrl,
            },
            leaf: false
          };
        });
        this.treeNodes = [...this.treeNodes];
      });
  }


  private loadImageShowForArea(parentNode: TreeNode): void {
    this.imageShowService.getImageShowByArea(parentNode.data.area)
      .then((imageShows: ImageShow[]) => {
        parentNode.children = imageShows.map((imageShow: ImageShow): TreeNode => {
          return {
            label: imageShow.name,
            type: 'IMAGE_SHOW',
            data: imageShow,
            leaf: false
          };
        });
        this.treeNodes = [...this.treeNodes];
      });
  }

  private loadShowPartsFromImageShow(parentNode: TreeNode): void {
    this.showPartService.getShowPartsFromImageShow(parentNode.data.resourceUrl).then((showParts: ShowPart[]) => {
      parentNode.children = showParts.map((showPart: ShowPart): TreeNode => {
        return {
          type: 'PICTURE',
          data: {
            showPartId: showPart.showPartId,
            showPartImage: showPart.showPartImage,
            new: true
          },
          leaf: true
        };
      });
    });
  }

  private loadImagesFromDocument(parentNode: TreeNode): void {
    this.imageService.getImagesFromDocument(parentNode.data.resourceUrl).then((images: Image[]) => {
      parentNode.children = images.map((image: Image) => {
        return {
          type: 'PICTURE',
          data: {
            showPartId: image.id,
            showPartImage: image.image,
            new: true
          },
          leaf: true
        };
      });
    });
  }

  public editImageShow(node: TreeNode): void {
    this.onImageShowEdited.emit(node.data.resourceUrl);
  }

  public deleteImageShow(node: TreeNode): void {

    (node.data as ImageShow).resourceUrl = (node.data as ImageShow).resourceUrl;
    console.log(node.data);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the Image Show?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.imageShowService.deleteImageShow(node.data).then((res: { message: string }) => {
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

  public searchDocuments(event: { query: string }): void {
    const filterName = event.query;
    this.loadAreas(this.treeNodes[0]);
    this.documentService.getDocumentsByFileNameContains(filterName)
      .then((documents: Document[]) => {
        documents.forEach((document: Document) => {
          this.filteredDocuments = documents;
          const node: TreeNode = {
            label: document.fileName,
            type: 'DOCUMENT',
            data: {
              resourceUrl: document.resourceUrl,
            },
            leaf: false
          };
          const areaNode = this.treeNodes[1].children.filter(n => n.type == 'DOCUMENTS_AREA' && n.data.area == document.area)[0];
          if (areaNode) {
            areaNode.children ? areaNode.children.push(node) : areaNode.children = [node];
          }
        });
        this.treeNodes[0].children = this.treeNodes[0].children.filter(n => n.children || n.type != 'DOCUMENTS_AREA');
        this.treeNodes = [...this.treeNodes];
      });
  }

  public searchImageShows(event: { query: string }): void {
    const filterName = event.query;
    this.loadAreas(this.treeNodes[1]);
    this.imageShowService.getImageShowsByNameContains(filterName).then(
      (imageShows: ImageShow[]) => {
        this.filteredImageShows = imageShows;
        imageShows.forEach((imageShow: ImageShow) => {
          const node: TreeNode = {
            label: imageShow.name,
            type: 'IMAGE_SHOW',
            data: {
              resourceUrl: imageShow.resourceUrl,
            },
            leaf: false
          };
          const areaNode = this.treeNodes[1].children.filter(n => n.type == 'IMAGE_SHOWS_AREA' && n.data.area == imageShow.area)[0];
          if (areaNode) {
            areaNode.children ? areaNode.children.push(node) : areaNode.children = [node];
          }

        });
        this.treeNodes[1].children = this.treeNodes[1].children.filter((node: TreeNode) => node.children || node.type != 'IMAGE_SHOWS_AREA');
        this.treeNodes = [...this.treeNodes];
      });
  }

  resetChildrenNodes(node: TreeNode) {
    node.children = null;
    this.loadAreas(node);
  }

  public search(node: TreeNode): void {
    if (!node.children[0].type.includes('SEARCH_')) {
      node.children.splice(0, 0, {
        label: 'search',
        type: 'SEARCH_' + node.type,
        leaf: true
      });
    }
  }

  public returnFalse(): boolean {
    return false;
  }

  public onNodeSelect(event): void {
    console.log(event);

  }

}
