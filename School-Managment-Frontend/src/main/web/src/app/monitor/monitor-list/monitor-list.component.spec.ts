import { Monitor } from './../monitor.model';
import { Observable, of } from 'rxjs';
import { DefaultLangChangeEvent, LangChangeEvent, TranslateService, TranslationChangeEvent, TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ImageShowService } from './../../image-show/image-show.service';
import { MonitorService } from './../monitor.service';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorListComponent } from './monitor-list.component';
import { AreaService } from 'src/app/area/area.service';
import { EventEmitter } from '@angular/core';

describe('MonitorListComponent', () => {
  let component: MonitorListComponent;
  let fixture: ComponentFixture<MonitorListComponent>;

  let monitorServiceMock: Partial<MonitorService> = {
    getAllMonitors(): Promise<Monitor[]> {
      return of([]).toPromise();
    }
  };

  let areaServiceMock: Partial<AreaService> = {
    getAllAreas(): Promise<string[]> {
      return of(['EVENT', 'SUBSTITUTION', 'AFTERCARE']).toPromise();
    }
  };

  let imageShowServiceMock: Partial<ImageShowService> = {

  };
  let messageServiceMock: Partial<MessageService> = {

  };

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
      declarations: [MonitorListComponent],
      imports: [TranslateModule],
      providers: [
        { provide: MonitorService, useValue: monitorServiceMock },
        { provide: AreaService, useValue: areaServiceMock },
        { provide: ImageShowService, useValue: imageShowServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
