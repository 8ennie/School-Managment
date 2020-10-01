import { Document } from './document.model';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl + 'documents';
const UPLOAD_URL = environment.apiUrl + 'upload';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private readonly http: HttpClient,
  ) { }


  getAllDocuments() {
    return this.http.get(API_URL).toPromise();
  }

  getDocument(id: string) {
    return this.http.get(API_URL + '/' + id + '?projection=documentProjection').toPromise();
  }

  uploadDocument(doc: FormData) {
    return this.http.post<any>(UPLOAD_URL + "/document", doc).pipe(
      catchError((err: HttpErrorResponse) => {
        return this.handleError(err);
      })
    ).toPromise();
  }

  saveDocument(document: Document): Promise<void | Document> {
    return this.http.post<Document>(API_URL, document).pipe(
      catchError((err: HttpErrorResponse) => {
        return this.handleError(err);
      })
    ).toPromise();
  }


  deleteDocument(id: string) {
    return this.http.delete(API_URL + '/' + id).toPromise();
  }

  getImageShowParts(documentId) {
    let showPartURL = environment.apiUrl + 'showParts/search/findByParentDocument?parentDocument=' + environment.apiUrl + 'documents/' + documentId;
    return this.http.get(showPartURL).toPromise();
  }

  getDocumentsByArea(area: string) {
    return this.http.get(API_URL + '/search/findByArea?area=' + area + '&&projection=documentProjection').toPromise();
  }

  getDocumentsByFileNameContains(fileName: string) {
    return this.http.get(API_URL + '/search/findByFileNameContains?fileName=' + fileName + '&&projection=documentProjection').toPromise();
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
