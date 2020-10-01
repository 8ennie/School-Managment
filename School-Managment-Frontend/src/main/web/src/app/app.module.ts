import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { PrimeNGModule } from './primeNG.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { authInterceptorProviders } from './_helper/auth.interceptor';
import { InsertDirective } from './_directives/insert-point.directive';
import { httpErrorInterceptorProviders } from './_helper/http-error.interceptor';
import { PhotoShowComponent } from './photo-show/photo-show.component';
import { UploadPhotoShowComponent } from './photo-show/upload-photo-show/upload-photo-show.component';
import { MonitorComponent } from './photo-show/monitor/monitor.component';
import { UserListComponent } from './auth/user/user-list/user-list.component';
import { UserDetailsComponent } from './auth/user/user-details/user-details.component';
import { UserComponent } from './auth/user/user.component';
import { RoleComponent } from './auth/role/role.component';
import { RoleListComponent } from './auth/role/role-list/role-list.component';
import { RoleDetailsComponent } from './auth/role/role-details/role-details.component';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageComponent } from './message/message.component';
import { ScrollingTextComponent } from './message/scrolling-text.component';
import { SendMessageComponent } from './message/send-message/send-message.component';
import { EditImageShowComponent } from './photo-show/edit-image-show/edit-image-show.component';
import { ImageListComponent } from './photo-show/image-list/image-list.component';
import { UploadDocumentComponent } from './photo-show/document/upload-document/upload-document.component';
import { UploadImageShowComponent } from './photo-show/edit-image-show/upload-image-show/upload-image-show.component';
import { AreaComponent } from './photo-show/area/area.component';



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    HomeComponent,
    InsertDirective,
    PhotoShowComponent,
    UploadPhotoShowComponent,
    MonitorComponent,
    UserListComponent,
    UserDetailsComponent,
    UserComponent,
    RoleComponent,
    RoleListComponent,
    RoleDetailsComponent,
    MessageComponent,
    ScrollingTextComponent,
    SendMessageComponent,
    EditImageShowComponent,
    ImageListComponent,
    UploadDocumentComponent,
    UploadImageShowComponent,
    AreaComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PrimeNGModule,
    DragDropModule,
    InputMaskModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatDialogModule,
  ],
  entryComponents: [
  ],
  providers: [
    authInterceptorProviders,
    httpErrorInterceptorProviders,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/translations/', '.json');
}


