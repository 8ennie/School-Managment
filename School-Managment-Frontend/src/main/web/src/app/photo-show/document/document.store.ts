import { List } from 'immutable';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DocumentService } from './document.service';
import { Document } from './document.model';


@Injectable({providedIn: 'root'})
export class DocumentStore {

    private _documents: BehaviorSubject<List<Document>> = new BehaviorSubject(List([]));
    public readonly documents: Observable<List<Document>> = this._documents.asObservable();


    constructor(
        private readonly documentService: DocumentService
    ) {
        this.loadInitialData();
    }

    loadInitialData() {
        this.documentService.getAllDocuments()
            .then(
                (res: {_embedded}) => {
                    const documents = res._embedded.documents;
                    this._documents.next(List(documents));
                },
                err => {
                    console.log(err);
                    console.log('Error retrieving Documents!');
                }
            );
    }

    addDocument(newDocument: Document) {
        const obs = this.documentService.saveDocument(newDocument);
        obs.then(
            res => {
                if (res) {
                    const id: number = res._links.self.href.split('/').pop();
                    this.documentService.getDocument(id.toString()).then((document: Document) => {
                        this._documents.next(this._documents.getValue().push(document));
                    });
                }
            });
        return obs;
    }

    deleteDocument(deleted: Document) {
        const obs = this.documentService.deleteDocument(deleted.id);
        obs.then(
            res => {
                const documents: List<Document> = this._documents.getValue();
                const index = documents.findIndex((document) => document.id === deleted.id);
                this._documents.next(documents.delete(index));
            }
        );
        return obs;
    }

    getImageShowParts(document: Document) {
        return this.documentService.getImageShowParts(document);
    }

}
