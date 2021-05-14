import { Privilege } from './../privilege.model';
import { HateoasCollection, Embeddeds } from './../../_helper/spring-hateoas/hateoas-collection';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Role, RoleHateoas } from './role.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl + 'roles';

interface EmbeddedRoleHateoas extends Embeddeds<RoleHateoas> {
    monitors: RoleHateoas[];
}

@Injectable({ providedIn: 'root' })
export class RoleService {

    roles: Role[];

    constructor(
        private http: HttpClient,
    ) { }

    public getAllRoles(): Promise<Role[]> {
        if (this.roles) {
            return new Promise<Role[]>((resolve) => {
                resolve(this.roles);
            });
        } else {
            return this.http.get<HateoasCollection<EmbeddedRoleHateoas>>(API_URL)
                .pipe(
                    map(
                        (roleHateoasCollection: HateoasCollection<EmbeddedRoleHateoas>): Role[] => {
                            const roleHateoasArray: RoleHateoas[] = roleHateoasCollection._embedded.roles;
                            this.roles = roleHateoasArray.map((r: RoleHateoas): Role => Object.assign(new Role(), r));
                            return this.roles;
                        }
                    )).toPromise();
        }
    }

    public getRole(resourceUrl: string): Promise<Role> {
        return this.http
            .get<EmbeddedRoleHateoas>(
                resourceUrl + '?projection=roleProjection'
            )
            .pipe(
                map(
                    (roleHateoas: EmbeddedRoleHateoas): Role =>
                        Object.assign(new Role(), roleHateoas)
                )
            )
            .toPromise();
    }

    public saveRole(role: Role): Promise<void | Role> {
        return this.http
            .post<EmbeddedRoleHateoas>(API_URL, role)
            .pipe(
                map(
                    (roleHateoas: EmbeddedRoleHateoas): Role =>
                        Object.assign(new Role(), roleHateoas)
                ),
                catchError((err: HttpErrorResponse) => {
                    return this.handleError(err);
                })
            )
            .toPromise();
    }

    public updateRole(role: Role): Promise<Role> {
        return this.http.patch<EmbeddedRoleHateoas>(role.resourceUrl, role)
            .pipe(
                map(
                    (roleHateoas: EmbeddedRoleHateoas): Role =>
                        Object.assign(new Role(), roleHateoas)
                ),
                catchError((err: HttpErrorResponse) => {
                    return this.handleError(err);
                })
            ).toPromise();
    }

    public deleteRole(role: Role): Promise<void> {
        return this.http.delete<void>(role.resourceUrl).toPromise();
    }


    private handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            if (error.status === 409 && error.error.message.includes('ConstraintViolationException')) {
                return throwError(
                    'ConstraintViolationException');
            }
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    }

}
