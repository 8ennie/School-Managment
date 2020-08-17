import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadPhotoShowService {

    private url: string = environment.apiUrl + 'imageShows';
    private uploadUrl: string = environment.apiUrl + 'upload';

    constructor(private http: HttpClient) { }

    getFiles(){
        return this.http.get(this.url).toPromise()
        .then(d => {
            console.log(d);
            return d
        })
        .then((data:{_embedded}) => {
            let imageShows = []
            if (data._embedded.imageShow) {
                imageShows.push(...data._embedded.imageShow)
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

    saveFile(file){
        return this.http.post(this.url, file).toPromise();
    }

    savePhotoShow(upfile){
        return this.http.post(this.uploadUrl, upfile).toPromise();
    }

    saveSubstitutionShow(uploadFile){
        return this.http.post(this.uploadUrl + '/substitution', uploadFile).toPromise();
    }

    saveAdvertismentShow(uploadFile){
        return this.http.post(this.uploadUrl + '/advertisment', uploadFile).toPromise();
    }

    delete(id:number){
        return this.http.delete(this.url + "/" + id).toPromise();
    }

    edit(id:number,imageShow){
        return this.http.put(this.url + "/" + id, imageShow).toPromise();
    }

    getImageShowParts(id:number){
        return this.http.get(this.url + "/" + id + "/" + "showParts").toPromise().then((data:{_embedded}) => data._embedded.showParts);
    }

}