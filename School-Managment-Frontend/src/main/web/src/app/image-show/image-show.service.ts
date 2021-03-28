import { Embeddeds, HateoasCollection } from './../_helper/spring-hateoas/hateoas-collection';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ImageShow, ImageShowHateoas } from './image-show.model';


const API_URL = environment.apiUrl + 'imageShows';
const UPLOAD_URL = environment.apiUrl + 'upload';

interface EmbeddedImageShowHateoas extends Embeddeds<ImageShowHateoas> {
    imageShows: ImageShowHateoas[];
}

@Injectable({ providedIn: 'root' })
export class ImageShowService {

    constructor(
        private readonly http: HttpClient,
    ) {
        this.getAllImageShows();
    }

    public getAllImageShows(): Promise<ImageShow[]> {
        return this.http.get<HateoasCollection<EmbeddedImageShowHateoas>>(API_URL)
            .pipe(
                map(
                    (imageShowHateoasCollection: HateoasCollection<EmbeddedImageShowHateoas>): ImageShow[] => {
                        const imageShowHateoasArray: ImageShowHateoas[] = imageShowHateoasCollection._embedded.imageShows;
                        return imageShowHateoasArray.map((im: ImageShowHateoas): ImageShow => Object.assign(new ImageShow(), im));
                    }
                )
            )
            .toPromise();
    }

    public getImageShow(id: string): Promise<ImageShow> {
        return this.http.get<EmbeddedImageShowHateoas>(API_URL + '/' + id + '?projection=imageShowProjection')
            .pipe(
                map((imageShowHateoas: EmbeddedImageShowHateoas): ImageShow => Object.assign(new ImageShow(), imageShowHateoas))
            )
            .toPromise();
    }

    public saveImageShow(imageShow: ImageShow): Promise<ImageShow> {
        return this.http.post<EmbeddedImageShowHateoas>(API_URL, imageShow)
            .pipe(
                map((imageShowHateoas: EmbeddedImageShowHateoas): ImageShow => Object.assign(new ImageShow(), imageShowHateoas)),
                catchError((err: HttpErrorResponse) => {
                    return this.handleError(err);
                })
            ).toPromise();
    }

    public uploadImageShow(file: FormData): Promise<ImageShow> {
        return this.http.post<any>(UPLOAD_URL + '/show', file).pipe(
            tap((im) => {
                console.log(im);
            }),
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    public updateImageShow(imageShow: ImageShow): Promise<ImageShow> {
        return this.http.patch<EmbeddedImageShowHateoas>(imageShow.resourceUrl, imageShow)
            .pipe(
                map((imageShowHateoas: EmbeddedImageShowHateoas): ImageShow => Object.assign(new ImageShow(), imageShowHateoas)),
                catchError((err: HttpErrorResponse) => {
                    return this.handleError(err);
                })
            ).toPromise();
    }

    public deleteImageShow(imageShow: ImageShow): Promise<{ message: string }> {
        return this.http.delete<{ message: string }>(imageShow.resourceUrl).toPromise();
    }

    public getImageShowByArea(area: string): Promise<ImageShow[]> {
        return this.http.get<HateoasCollection<EmbeddedImageShowHateoas>>(API_URL + '/search/findByArea?area=' + area)
            .pipe(
                map(
                    (imageShowHateoasCollection: HateoasCollection<EmbeddedImageShowHateoas>): ImageShow[] => {
                        const imageShowHateoasArray: ImageShowHateoas[] = imageShowHateoasCollection._embedded.imageShows;
                        return imageShowHateoasArray.map((im: ImageShowHateoas): ImageShow => Object.assign(new ImageShow(), im));
                    }
                )
            ).toPromise();
    }

    saveImageShowParts(imageShowId, imageShowParts) {
        const imageShowPartRequest = {
            update: false,
            imageShowParts: imageShowParts.map(isp => {
                return { showPartId: isp.showPartId, active: isp.active };
            }),
            imageShowId
        };
        return this.http.post(API_URL + '/showParts', imageShowPartRequest).toPromise();
    }

    updateImageShowParts(imageShowId, imageShowParts) {
        const imageShowPartRequest = {
            update: true,
            imageShowParts: imageShowParts.map(isp => {
                return { showPartId: isp.showPartId, active: isp.active, imageShowShowPartId: isp.id ? isp.id : null };
            }),
            imageShowId
        };
        return this.http.post(API_URL + '/showParts', imageShowPartRequest).toPromise();
    }

    getImageShowsByNameContains(name: string) {
        return this.http.get(API_URL + '/search/findByNameContains?name=' + name + '&&projection=imageShowProjection').toPromise();
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            if (error.status === 409 && error.error.message.includes('ConstraintViolationException')) {
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
