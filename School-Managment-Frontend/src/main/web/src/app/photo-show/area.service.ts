import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class AreaService {


    constructor(
        private http: HttpClient,
    ) {

    }
    getAllAreas() {
        return this.http.get(API_URL + 'values/areas').toPromise();
    }

}