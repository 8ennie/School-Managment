import { map } from 'rxjs/operators';
import { ShowPart, ShowPartHateoas } from './show-part.model';
import { Embeddeds, HateoasCollection } from './../../_helper/spring-hateoas/hateoas-collection';
import { environment } from './../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const API_URL = environment.apiUrl + 'imageShowShowParts';

interface EmbeddedShowPartHateoas extends Embeddeds<ShowPartHateoas> {
  imageShowShowParts: ShowPartHateoas[];
}

@Injectable({
  providedIn: 'root'
})
export class ShowPartService {

  constructor(private readonly http: HttpClient) { }

  public getShowShowPartsFromImageShow(imageShowUrl: string): Promise<ShowPart[]> {
    const showPartURL = API_URL + '/search/findByImageShow?imageShow=' + imageShowUrl + '&projection=imageShowPartProjection';
    return this.http.get<HateoasCollection<EmbeddedShowPartHateoas>>(showPartURL)
      .pipe(
        map(
          (showPartHateoasCollection: HateoasCollection<EmbeddedShowPartHateoas>): ShowPart[] => {
            const showPartHateoasArray: ShowPartHateoas[] = showPartHateoasCollection._embedded.imageShowShowParts;
            return showPartHateoasArray.map((showPart: ShowPartHateoas): ShowPart => Object.assign(new ShowPart(), showPart));
          })
      )
      .toPromise();
  }
}
