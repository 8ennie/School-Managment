import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ImageShow } from './image-show.model';


const API_URL = environment.apiUrl + 'imageShows';

const UPLOAD_URL = environment.apiUrl + 'upload';

@Injectable({ providedIn: 'root' })
export class ImageShowService {

    constructor(
        private http: HttpClient,
    ) { }

    getAllImageShows() {
        return this.http.get(API_URL).toPromise()
            // .then(d => {
            //     console.log(d);
            //     return d
            // })
            .then((data: { _embedded }) => {
                let imageShows = []
                if (data._embedded.imageShows) {
                    imageShows.push(...data._embedded.imageShows)
                }
                if (data._embedded.advertismentShows) {
                    imageShows.push(...data._embedded.advertismentShows)
                }
                if (data._embedded.substitutionShows) {
                    imageShows.push(...data._embedded.substitutionShows)
                }
                return imageShows
            });
    }

    getImageShow(id: string) {
        return this.http.get(API_URL + '/' + id + '?projection=imageShowProjection').toPromise();
    }

    saveImageShow(imageShow: ImageShow): Promise<void | ImageShow> {
        return this.http.post<ImageShow>(API_URL, imageShow).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    saveImageShow2(file): Promise<void | ImageShow> {
        return this.http.post<any>(UPLOAD_URL + "/show", file).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    updateImageShow(imageShow: ImageShow) {
        return this.http.patch(API_URL + '/' + imageShow.id, imageShow).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    deleteImageShow(id: String) {
        return this.http.delete(API_URL + '/delete/' + id).toPromise();
    }

    getImageShowByArea(area: string) {
        return this.http.get(API_URL + '/search/findByArea?area=' + area).toPromise();
    }

    saveImageShowParts(imageShowId, imageShowParts) {
        let imageShowPartRequest = {
            "update": false,
            "imageShowParts": imageShowParts.map(isp => {
                return { showPartId: isp.showPartId, active: isp.active };
            }),
            "imageShowId": imageShowId
        }
        return this.http.post(API_URL + '/showParts', imageShowPartRequest).toPromise();
    }

    updateImageShowParts(imageShowId, imageShowParts) {
        let imageShowPartRequest = {
            "update": true,
            "imageShowParts": imageShowParts.map(isp => {
                return { showPartId: isp.showPartId, active: isp.active, imageShowShowPartId: isp.id ? isp.id : null };
            }),
            "imageShowId": imageShowId
        }
        return this.http.post(API_URL + '/showParts', imageShowPartRequest).toPromise();
    }

    getImageShowsByNameContains(name: string) {
        return this.http.get(API_URL + '/search/findByNameContains?name=' + name + '&&projection=imageShowProjection').toPromise();
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