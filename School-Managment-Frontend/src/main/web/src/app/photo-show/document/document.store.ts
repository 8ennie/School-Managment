import { List } from 'immutable';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DocumentService } from './document.service';
import { Document } from './document.model';


@Injectable({providedIn:'root'})
export class DocumentStore {

    private _documents: BehaviorSubject<List<Document>> = new BehaviorSubject(List([]));
    public readonly documents: Observable<List<Document>> = this._documents.asObservable();


    constructor(
        private readonly documentService: DocumentService
    ){
        this.loadInitialData();
    }

    loadInitialData() {
        this.documentService.getAllDocuments()
            .then(
                (res:{_embedded}) => {
                    let documents = res._embedded.documents;
                    this._documents.next(List(documents));
                },
                err => console.log("Error retrieving ImageShowes")
            );
    }

    addDocument(newDocument: Document) {
        let obs = this.documentService.saveDocument(newDocument);
        obs.then(
            res => {
                if(res){
                    var id: number = res._links.self.href.split('/').pop();
                    this.documentService.getDocument(id.toString()).then((document: Document) => {
                        this._documents.next(this._documents.getValue().push(document));
                    });
                }
            });
        return obs;
    }

    deleteDocument(deleted: Document) {
        let obs = this.documentService.deleteDocument(deleted);
        obs.then(
            res => {
                let documents: List<Document> = this._documents.getValue();
                let index = documents.findIndex((document) => document.id === deleted.id);
                this._documents.next(documents.delete(index));
            }
        );
        return obs;
    }

    getImageShowParts(document:Document){
        return this.documentService.getImageShowParts(document);
    }

}