import { map } from 'rxjs/operators';
import { Embeddeds, HateoasCollection } from './../../_helper/spring-hateoas/hateoas-collection';
import { environment } from './../../../environments/environment';
import { Image, ImageHateoas } from './image.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = environment.apiUrl + 'showParts';

interface EmbeddedImageHateoas extends Embeddeds<ImageHateoas> {
  showParts: ImageHateoas[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private readonly http: HttpClient) { }

  public getImagesFromDocument(documentUrl: string): Promise<Image[]> {
    const showPartURL = API_URL + '/search/findByParentDocument?parentDocument=' + documentUrl + '&projection=showPartProjection';
    return this.http.get<HateoasCollection<EmbeddedImageHateoas>>(showPartURL)
      .pipe(
        map(
          (imageHateoasCollection: HateoasCollection<EmbeddedImageHateoas>): Image[] => {
            const imageHateoasArray: ImageHateoas[] = imageHateoasCollection._embedded.showParts;
            return imageHateoasArray.map((image: ImageHateoas): Image => Object.assign(new Image(), image));
          })
      )
      .toPromise();
  }
}
