import { AuthUser } from './../auth-user.model';
import { RouterTestingModule } from '@angular/router/testing';
import { PrimeNGModule } from './../../primeNG.module';
import { TranslateService, TranslationChangeEvent, LangChangeEvent, DefaultLangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { of, Observable } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { EventEmitter } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceMock: Partial<AuthService> = {
    login(): Promise<any> {
      return of({username: 'Max'}).toPromise();
    },

    getUser(): AuthUser {
      return { username: "Max Mustermann", areas: ['EVENT', 'SUBSTITUTION'] } as AuthUser;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        PrimeNGModule,
        ReactiveFormsModule,
        TranslateModule,
        RouterTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        MessageService,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate login credentials correctly', () => {
    let rootElement = fixture.nativeElement as HTMLElement;


    let formElement = rootElement.getElementsByTagName('form').item(0);

    let inputFields = formElement.getElementsByClassName('p-inputgroup');
    let usernameInput = inputFields.item(0).getElementsByTagName('input').item(0);
    usernameInput.value = '    ';
    usernameInput.dispatchEvent(new Event('input'));
    let paswordInput = inputFields.item(1).getElementsByTagName('input').item(0);
    paswordInput.value = '   ';
    paswordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.loginForm.valid).toBeFalsy();

    usernameInput.value = 'Max';
    usernameInput.dispatchEvent(new Event('input'));
    paswordInput.value = '123';
    paswordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService login method', waitForAsync(() => {

    let authService = TestBed.inject<AuthService>(AuthService);
    let loginSpy = spyOn(authService, 'login').and.callThrough();

    let rootElement = fixture.nativeElement as HTMLElement;
    let formElement = rootElement.getElementsByTagName('form').item(0);
    
    let inputFields = formElement.getElementsByClassName('p-inputgroup');

    let usernameInput = inputFields.item(0).getElementsByTagName('input').item(0);
    usernameInput.value = "user";
    usernameInput.dispatchEvent(new Event('input'));
    let paswordInput = inputFields.item(1).getElementsByTagName('input').item(0);
    paswordInput.value = "123";
    paswordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.loginForm.valid).toBeTruthy();

    let loginButton = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    loginButton.click();
    fixture.detectChanges();


    expect(loginSpy).toHaveBeenCalledTimes(1); // check that service is called once
  }));
});
