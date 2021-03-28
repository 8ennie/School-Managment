import { AreaService } from '../../area/area.service';
import { Observable, of } from 'rxjs';
import { TranslateService, TranslationChangeEvent, LangChangeEvent, DefaultLangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UploadDocumentComponent } from './upload-document.component';
import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentService } from '../document.service';


describe('UploadDocumentComponent', () => {
    let component: UploadDocumentComponent;
    let fixture: ComponentFixture<UploadDocumentComponent>;

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

    let documentSericeMock: Partial<DocumentService> = {

    }

    let areaService: Partial<AreaService> = {
        getUserAreas() {
            return of(['SUBSTITUTION', 'EVENT']).toPromise();
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                TranslateModule,
            ],
            declarations: [
                UploadDocumentComponent,
            ],
            providers:
                [
                    { provide: AreaService, useValue: areaService },
                    { provide: DocumentService, useValue: documentSericeMock },
                    { provide: TranslateService, useValue: translateServiceMock },
                ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadDocumentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });
});
