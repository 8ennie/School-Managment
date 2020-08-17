import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class AdvertismentService {
    

    private url: string = environment.apiUrl + 'advertismentShows';
    private uploadUrl: string = environment.apiUrl + 'upload';

    constructor(
        private http: HttpClient
    ) { }


    getAdvertisments(){
        return this.http.get(this.url).toPromise()
        // .then(d => {
        //     console.log(d);
        //     return d;
        // })
        .then((data:{_embedded}) => {
            return data._embedded.advertismentShows;
        });
    }

    saveAdvertisment(show){
        return this.http.post(this.uploadUrl + '/advertisment', show).toPromise();
    }

    deleteAdvertisment(id:number){
        return this.http.delete(this.url + "/" + id).toPromise();
    }

    getImageShowParts(id:number){
        return this.http.get(this.url + "/" + id + "/" + "showParts").toPromise().then((data:{_embedded}) => data._embedded.showParts);
    }
}