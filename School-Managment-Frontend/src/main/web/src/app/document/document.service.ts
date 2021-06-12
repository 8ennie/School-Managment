import { ShowPart } from './../image-show/show-part/show-part.model';
import { ImageShow } from './../image-show/image-show.model';
import { Embeddeds, HateoasCollection } from './../_helper/spring-hateoas/hateoas-collection';
import { Document, DocumentHateoas } from './document.model';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl + 'documents';
const UPLOAD_URL = environment.apiUrl + 'upload';


interface EmbeddedDocumentHateoas extends Embeddeds<DocumentHateoas> {
  documents: DocumentHateoas[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements OnDestroy {

  private readonly documentSubject: Subject<Document[]> = new ReplaySubject(1);
  private hasLoaded: boolean = false;

  constructor(
    private readonly http: HttpClient,
  ) { }

  ngOnDestroy(): void {
    if (this.documentSubject) {
      this.documentSubject.unsubscribe();
    }
  }

  public getAllDocuments(): Promise<Document[]> {
    if (!this.hasLoaded) {
      this.loadAllDocuments();
    }
    return this.documentSubject.toPromise();
  }

  public loadAllDocuments(): void {
    this.http
      .get<HateoasCollection<EmbeddedDocumentHateoas>>(API_URL)
      .pipe(
        map(
          (documentHateoasCollection: HateoasCollection<EmbeddedDocumentHateoas>): Document[] => {
            const documentHateoasArray: DocumentHateoas[] = documentHateoasCollection._embedded.documents;
            return documentHateoasArray.map((d: DocumentHateoas): Document => Object.assign(new Document(), d));
          })
      ).subscribe({
        next: (doucments: Document[]): void => {
          this.documentSubject.next(doucments);
          this.hasLoaded = true;
        }, error: (err: any): void => console.log(err),
      });
  }

  public getDocument(id: string): Promise<Document> {
    return this.http
      .get<EmbeddedDocumentHateoas>(API_URL + '/' + id + '?projection=documentProjection')
      .pipe(
        map((documentHateoas: EmbeddedDocumentHateoas): Document => Object.assign(new Document(), documentHateoas))
      )
      .toPromise();
  }

  public uploadDocument(doc: FormData): Promise<ShowPart[]> {
    return this.http.post<any>(UPLOAD_URL + '/document', doc)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return this.handleError(err);
        }),
        map((docImageShows): ShowPart[] => {
          let imageShows = [];
          docImageShows.forEach(imageShow => {
            let im = new ShowPart();
            im.showPartImage = imageShow.image;
            im.showPartId = imageShow.id;
            im.active = true;
            imageShows.push(im);
          });
          return imageShows;
        })
      )
      .toPromise();
  }

  // public saveDocument(document: Document): Promise<Document> {
  //   return this.http.post<EmbeddedDocumentHateoas>(API_URL, document).pipe(
  //     catchError((err: HttpErrorResponse) => {
  //       return this.handleError(err);
  //     }),
  //     map((documentHateoas: EmbeddedDocumentHateoas): Document => Object.assign(new Document(), documentHateoas))
  //   ).toPromise();
  // }

  public deleteDocument(document: Document): Promise<void> {
    return this.http.delete<void>(document.resourceUrl).toPromise();
  }

  public getDocumentsByArea(area: string): Promise<Document[]> {
    return this.http.get<HateoasCollection<EmbeddedDocumentHateoas>>(API_URL + '/search/findByArea?area=' + area + '&&projection=documentProjection')
      .pipe(
        map(
          (documentHateoasCollection: HateoasCollection<EmbeddedDocumentHateoas>): Document[] => {
            const documentHateoasArray: DocumentHateoas[] = documentHateoasCollection._embedded.documents;
            return documentHateoasArray.map((d: DocumentHateoas): Document => Object.assign(new Document(), d));
          })
      )
      .toPromise();
  }

  public getDocumentsByFileNameContains(fileName: string): Promise<Document[]> {
    return this.http.get<HateoasCollection<EmbeddedDocumentHateoas>>(API_URL + '/search/findByFileNameContains?fileName=' + fileName + '&&projection=documentProjection')
      .pipe(
        map(
          (documentHateoasCollection: HateoasCollection<EmbeddedDocumentHateoas>): Document[] => {
            const documentHateoasArray: DocumentHateoas[] = documentHateoasCollection._embedded.documents;
            return documentHateoasArray.map((d: DocumentHateoas): Document => Object.assign(new Document(), d));
          })
      )
      .toPromise();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status == 409 && error.error.message.includes('ConstraintViolationException')) {
        return throwError(
          'ConstraintViolationException');
      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
