import { catchError } from 'rxjs/operators';
import { List } from 'immutable';
import { Observable, throwError } from 'rxjs';
import { Role } from './role.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API_URL = environment.apiUrl + 'roles';

@Injectable({ providedIn: 'root' })
export class RoleService {

    constructor(
        private http: HttpClient,
    ) { }

    getAllRoles() {
        return this.http.get(API_URL).toPromise();
    }

    getRole(id: string) {
        return this.http.get(API_URL + '/' +  id + '?projection=roleProjection').toPromise();
    }

    getPrivileges(role: Role) {
        return this.http.get(role._links.privileges.href).toPromise();
    }

    getAllPrivileges() {
        return this.http.get(environment.apiUrl + 'privileges').toPromise();
    }

    saveRole(role: Role): Promise<void | Role> {
        return this.http.post<Role>(API_URL , role).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    updateRole(role: Role) {
        return this.http.patch(API_URL + '/' + role.id  , role).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    deleteRole(role: Role) {
        return this.http.delete(API_URL + '/' + role.id).toPromise();
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
