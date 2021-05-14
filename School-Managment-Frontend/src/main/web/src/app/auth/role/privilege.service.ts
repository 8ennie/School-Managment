import { PrivilegeHateoas } from './../privilege.model';
import { Privilege } from '../privilege.model';
import { HateoasCollection, Embeddeds } from '../../_helper/spring-hateoas/hateoas-collection';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Role, RoleHateoas } from './role.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl + 'privileges';

interface EmbeddedPrivilegeHateoas extends Embeddeds<PrivilegeHateoas> {
    monitors: PrivilegeHateoas[];
}

@Injectable({ providedIn: 'root' })
export class PrivilegeService {

    privileges: Privilege[];

    constructor(
        private http: HttpClient,
    ) { }

    public getAllPrivileges(): Promise<Privilege[]> {
        if (this.privileges) {
            return new Promise<Privilege[]>((resolve) => {
                resolve(this.privileges);
            });
        } else {
            return this.http.get<HateoasCollection<EmbeddedPrivilegeHateoas>>(API_URL)
                .pipe(
                    map(
                        (privilegeHateoasCollection: HateoasCollection<EmbeddedPrivilegeHateoas>): Privilege[] => {
                            const privilegeHateoasArray: PrivilegeHateoas[] = privilegeHateoasCollection._embedded.privileges;
                            this.privileges = privilegeHateoasArray.map((p: PrivilegeHateoas): Privilege => Object.assign(new Privilege(), p));
                            return this.privileges;
                        }
                    )).toPromise();
        }
    }

    public getPrivilege(resourceUrl: string): Promise<Privilege> {
        return this.http
            .get<EmbeddedPrivilegeHateoas>(
                resourceUrl
            )
            .pipe(
                map(
                    (privilegeHateoas: EmbeddedPrivilegeHateoas): Privilege =>
                        Object.assign(new Privilege(), privilegeHateoas)
                )
            )
            .toPromise();
    }

    public getPrivilegesForRole(role: Role): Promise<Privilege[]> {
        return this.http.get<HateoasCollection<EmbeddedPrivilegeHateoas>>(role.resourceUrl + '/privileges').pipe(
            map(
                (privilegeHateoasCollection: HateoasCollection<EmbeddedPrivilegeHateoas>): Privilege[] => {
                    const privilegeHateoasArray: PrivilegeHateoas[] = privilegeHateoasCollection._embedded.privileges;
                    this.privileges = privilegeHateoasArray.map((p: PrivilegeHateoas): Privilege => Object.assign(new Privilege(), p));
                    return this.privileges;
                }
            )).toPromise();
    }



}
