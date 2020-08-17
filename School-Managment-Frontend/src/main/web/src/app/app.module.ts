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
import { SubstitutionComponent } from './photo-show/substitution/substitution.component';
import { AdvertismentComponent } from './photo-show/advertisment/advertisment.component';



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
    SubstitutionComponent,
    AdvertismentComponent,
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


