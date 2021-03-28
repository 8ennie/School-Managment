import { map, tap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AreaService {

    private hasLoaded = false;

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
    ) { }

    private _areas: string[];

    private loadAllAreas(): Promise<string[]> {
        return this.http.get<string[]>(API_URL + 'values/areas')
            .pipe(
                tap((areas: string[]) => {
                    this._areas = areas;
                    this.hasLoaded = true;
                })
            )
            .toPromise();
    }

    public getAllAreas(): Promise<string[]> {
        if (!this.hasLoaded) {
            return new Promise((resolve) => {
                this.loadAllAreas().then((areas: string[]) => resolve(this._areas));
            });
        }
        return Promise.resolve(this._areas);
    }

    public getUserAreas(): Promise<string[]> {
        return Promise.resolve<string[]>(this.authService.getUser() ? this.authService.getUser().areas : []);
    }

}
