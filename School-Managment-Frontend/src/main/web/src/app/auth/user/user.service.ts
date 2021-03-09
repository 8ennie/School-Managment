import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from './user.model';


const API_URL = environment.apiUrl + 'users/';
const AUTH_URL = environment.apiUrl + 'auth/';

@Injectable({ providedIn: 'root' })
export class UserService {



    constructor(
        private http: HttpClient,
    ) { }

    getAllUsers() {
        return this.http.get(API_URL).toPromise();
    }

    getUser(id) {
        return this.http.get(API_URL +  id + '?projection=userProjection').toPromise();
    }

    saveUser(user: User): Promise<void | User> {
        return this.http.post<User>(AUTH_URL + 'signup', user).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log(err);
                return this.handleError(err);
            })
        ).toPromise();
    }

    updatetUser(user: User): Promise<void | User> {
        return this.http.patch<User>(API_URL + user.id, user).pipe(
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    deletetUser(user: User) {
        return this.http.delete(API_URL + user.id).toPromise();
    }

    getRoles(user) {
        return this.http.get(user._links.roles.href.replace('{?projection}', '')).toPromise();
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          if (error.status === 400 && error.error.message.includes('Username is already taken')) {
            return throwError(
                'UsernameExists');
          }
          if (error.status == 400 && error.error.message.includes('Email is already in use')) {
            return throwError(
                'EmailExists');
          }
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        return throwError(
          'Something bad happened; please try again later.');
      }
}
