import { AuthUser } from './auth-user.model';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './../_services/local-storage.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from 'src/app/auth/auth.service';
import { TestBed } from '@angular/core/testing';
import { Privilege } from './privilege.model';

describe('AuthService', () => {

    let httpMock: HttpTestingController;
    let service: AuthService;


    let localStorageServiceMock: Partial<LocalStorageService> = {
        getUser(): AuthUser {
            return { username: 'Max', privileges: [Privilege.CHANGE_SHOW, Privilege.LOCK_SHOW] } as AuthUser;
        },

        signOut() {},

        saveToken(token: string) {},

        saveUser(user) {},
    };

    beforeEach((() => {
        TestBed.configureTestingModule({

            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                { provide: LocalStorageService, useValue: localStorageServiceMock },
            ]
        })

        httpMock = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AuthService);

    }));

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    fit('should perform a post to /auth with email and password', () => {
        const email = 'email';
        const password = 'password';

        service.login({ username: 'Max', password: '123' }).then((data) => {
            expect(data['privileges']).toBeTruthy();
            expect(data['token']).toBeTruthy();
        });
        httpMock.expectOne(`${environment.apiUrl}auth/signin`).flush({ token: "123", roles: ['test'] });
    });


    fit('should return priviliges', () => {
        service.getPrivileges();
    });


});
