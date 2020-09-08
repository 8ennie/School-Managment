import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PhotoShowService {

    private url: string = environment.apiUrl + 'imageShows';
    private apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCurrentSubstitutionShow(){
        return this.http.get(this.apiUrl + 'currentSubstitutionShowParts').toPromise();
    }

    getShows(){
        return this.http.get(this.url).toPromise();
    }


    getShow(id : number){
        return this.http.get(this.url + '/' + id + '?projection=imageShowProjection').toPromise();
    }

    saveFile(file){
        return this.http.post(this.url, file).subscribe();
    }

    getShowShowParts(id : number){
        let showPartURL = this.apiUrl + 'imageShowShowParts/search/findByImageShow?imageShow=' + this.apiUrl + 'imageShows/' + id + '&projection=imageShowPartProjection';
        return this.http.get(showPartURL).toPromise();
    }
}