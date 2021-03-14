import { AuthUser } from './../auth/auth-user.model';
import { AreaService } from './../photo-show/area.service';
import { Privilege } from './../auth/privilege.model';
import { AuthGuard } from './../auth/auth.guard';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PrimeNGModule } from './../primeNG.module';
import { TranslateService, TranslationChangeEvent, LangChangeEvent, DefaultLangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { ComponentFixture, waitForAsync, TestBed, fakeAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../auth/auth.service';
import { EventEmitter, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';


describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let componentRootElement: HTMLElement;

    @Component({
        template: ''
    })
    class DummyComponent { }

    const routes: Routes = [
        { path: '', component: DummyComponent },
        {
            path: 'auth', children: [
                { path: '', component: DummyComponent },
                { path: 'users', component: DummyComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_USER] } },
                { path: 'roles', component: DummyComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_USER] } },
            ]
        },
        {
            path: 'photoshow', children: [
                { path: 'messages', component: DummyComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_MESSAGES] } },
                { path: 'list', component: DummyComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_IMAGE_SHOW] } },
                { path: 'monitors', component: DummyComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_MONITORS] } },
                { path: 'areas/:area', component: DummyComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_MONITORS] } },
                { path: 'edit/:id', component: DummyComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_IMAGE_SHOW] } },
                { path: 'show/:id', component: DummyComponent }
            ]
        },
    ];

    let authServiceMock: Partial<AuthService> = {
        userChanges: new Subject<AuthUser>(),
        getUser(): AuthUser {
            return { username: "Max Mustermann", areas: ['EVENT', 'SUBSTITUTION'] } as AuthUser;
        },
        isAthenticated(): boolean {
            return true;
        },
        hasPrivileges(): boolean {
            return true;
        },
    }

    let translateServiceMock: Partial<TranslateService> = {
        instant(key: string | string[], interpolateParms?: Object): any {
            return key + '.translated';
        },

        get(key: string | string[], interpolateParms?: Object): Observable<any> {
            return of(key + '.translated');
        },

        onTranslationChange: new EventEmitter<TranslationChangeEvent>(),
        onLangChange: new EventEmitter<LangChangeEvent>(),
        onDefaultLangChange: new EventEmitter<DefaultLangChangeEvent>(),
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                PrimeNGModule,
                RouterTestingModule,
                RouterTestingModule.withRoutes(routes),
                TranslateModule,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [HeaderComponent, DummyComponent],
            providers: [
                { provide: TranslateService, useValue: translateServiceMock },
                { provide: AuthService, useValue: authServiceMock },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;

        componentRootElement = fixture.debugElement.nativeElement as HTMLElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show user and logout button if authenticated', fakeAsync(() => {
        fixture.autoDetectChanges();

        expect(componentRootElement.getElementsByClassName('toolbar-navigation').length).toEqual(1);
        expect(componentRootElement.getElementsByClassName('user-navigation').length).toEqual(1);
    }));

    it('should show login button if not authenticated', fakeAsync(() => {
        let service = TestBed.inject<AuthService>(AuthService);
        spyOn(service, 'isAthenticated').and.returnValue(false);
        fixture.autoDetectChanges();

        expect(componentRootElement.getElementsByClassName('toolbar-navigation').length).toEqual(0);
        expect(componentRootElement.getElementsByClassName('user-navigation').length).toEqual(0);
        expect(componentRootElement.getElementsByTagName('button').length).toEqual(1);
    }));

});