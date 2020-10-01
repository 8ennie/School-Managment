import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AreaService {


    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {

    }
    getAllAreas() {
        return this.http.get(API_URL + 'values/areas').toPromise();
    }

    getUserAreas() {
        return Promise.resolve(this.authService.getUser().areas ? this.authService.getUser().areas : []);
    }

}