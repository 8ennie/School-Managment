import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageShowComponent } from './upload-image-show.component';

describe('UploadImageShowComponent', () => {
  let component: UploadImageShowComponent;
  let fixture: ComponentFixture<UploadImageShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadImageShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImageShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
