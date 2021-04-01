import { ImageShow } from 'src/app/image-show/image-show.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ShowPart, ShowPartHateoas } from './show-part.model';
import { Embeddeds, HateoasCollection } from './../../_helper/spring-hateoas/hateoas-collection';


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

  public getShowPartsFromImageShow(imageShowUrl: string): Promise<ShowPart[]> {
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

  public updateShowPartsForImageShow(showParts: ShowPart[], imageShowUrl: string): Promise<ImageShow> {
    const imageShowPartRequest = {
      update: true,
      imageShowParts: showParts,
      imageShowId: imageShowUrl.split('/').slice(-1)[0]
    };
    return this.http.post<ImageShow>(environment.apiUrl + 'imageShows' + '/showParts', imageShowPartRequest).toPromise();
  }

  public saveShowPartsForImageShow(showParts: ShowPart[], imageShowUrl: string): Promise<ImageShow> {
    const imageShowPartRequest = {
      update: false,
      imageShowParts: showParts,
      imageShowId: imageShowUrl.split('/').slice(-1)[0]
    };
    return this.http.post<ImageShow>(environment.apiUrl + 'imageShows' + '/showParts', imageShowPartRequest).toPromise();
  }
}
