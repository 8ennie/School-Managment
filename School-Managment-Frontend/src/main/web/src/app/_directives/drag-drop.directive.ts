import { DocumentService } from './../document/document.service';
import { ImageShow } from './../image-show/image-show.model';
import { ConfirmationService } from 'primeng/api';
import { ShowPart } from './../image-show/show-part/show-part.model';
import { Directive, Output, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appDragDrop]'
})
export class DragDropDirective {
    @Output() onFileDropped = new EventEmitter<ShowPart[]>();

    @Output() onFileUploading = new EventEmitter<boolean>();

    @Input() imageShow: ImageShow;

    @HostBinding('style.background-color') private background = '#f5fcff'
    @HostBinding('style.opacity') private opacity = '1'


    constructor(
        private readonly confirmationService: ConfirmationService,
        private readonly documentService: DocumentService,
    ) { }


    //Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#9ecbec';
        this.opacity = '0.8';
    }
    //Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#f5fcff'
        this.opacity = '1'
    }
    //Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#f5fcff'
        this.opacity = '1'
        let files = evt.dataTransfer.files;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file: File = files[i];
                if (file.type == 'application/pdf') {
                    this.confirmationService.confirm({
                        message: ('Add [' + file.name + '] to Show [' + this.imageShow.name + ']'),
                        header: ('Update Presentation'),
                        accept: () => {
                            this.onFileUploading.emit(true);
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('area', this.imageShow.area);
                            this.documentService.uploadDocument(formData).then((showParts: ShowPart[]) => {
                                this.onFileUploading.emit(false);
                                this.onFileDropped.emit(showParts);
                            });
                        },
                        reject: () => {
                            return;
                        }
                    });
                }
            }
        }
    }

}