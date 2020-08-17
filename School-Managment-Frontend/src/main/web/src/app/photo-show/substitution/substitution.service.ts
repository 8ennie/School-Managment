import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class SubstitutionService {

    private url: string = environment.apiUrl + 'substitutionShows';
    private uploadUrl: string = environment.apiUrl + 'upload';

    constructor(
        private http: HttpClient
    ) { }


    getSubsitutions(){
        return this.http.get(this.url).toPromise()
        // .then(d => {
        //     console.log(d);
        //     return d;
        // })
        .then((data:{_embedded}) => {
            return data._embedded.substitutionShows;
        });
    }

    saveSubstitution(formData: FormData){
        return this.http.post(this.uploadUrl + '/substitution', formData).toPromise();
    }

    delete(id:number){
        return this.http.delete(this.url + "/" + id).toPromise();
    }

    getImageShowParts(id:number){
        return this.http.get(this.url + "/" + id + "/" + "showParts").toPromise().then((data:{_embedded}) => data._embedded.showParts);
    }
}