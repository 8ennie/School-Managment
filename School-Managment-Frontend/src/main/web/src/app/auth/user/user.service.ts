import { Embeddeds, HateoasCollection } from './../../_helper/spring-hateoas/hateoas-collection';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User, UserHateoas } from './user.model';


const API_URL = environment.apiUrl + 'users/';
const AUTH_URL = environment.apiUrl + 'auth/';

interface EmbeddedUserHateoas extends Embeddeds<UserHateoas> {
    users: UserHateoas[];
}

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        private http: HttpClient,
    ) { }

    public getAllUsers(): Promise<User[]> {
        return this.http.get<HateoasCollection<EmbeddedUserHateoas>>(API_URL)
            .pipe(
                map(
                    (userHateoasCollection: HateoasCollection<EmbeddedUserHateoas>): User[] => {
                        const userHateoasArray: UserHateoas[] = userHateoasCollection._embedded.users;
                        return userHateoasArray.map((u: UserHateoas): User => Object.assign(new User(), u));
                    }
                )).toPromise();
    }

    public getUser(resourceUrl: string): Promise<User> {
        return this.http.get<EmbeddedUserHateoas>(resourceUrl + '?projection=userProjection')
            .pipe(
                map(
                    (userHateoas: EmbeddedUserHateoas): User =>
                        Object.assign(new User(), userHateoas)
                )
            )
            .toPromise();
    }

    public saveUser(user: User): Promise<void | User> {
        return this.http.post<User>(AUTH_URL + 'signup', user).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log(err);
                return this.handleError(err);
            })
        ).toPromise();
    }

    public updatetUser(user: User): Promise<User> {
        return this.http.patch<EmbeddedUserHateoas>(user.resourceUrl, user).pipe(
            map(
                (userHateoas: EmbeddedUserHateoas): User =>
                    Object.assign(new User(), userHateoas)
            ),
            catchError((err: HttpErrorResponse) => {
                return this.handleError(err);
            })
        ).toPromise();
    }

    public deletetUser(user: User): Promise<void> {
        return this.http.delete<void>(user.resourceUrl).toPromise();
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
