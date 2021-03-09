import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageShowComponent } from './edit-image-show.component';

describe('EditImageShowComponent', () => {
  let component: EditImageShowComponent;
  let fixture: ComponentFixture<EditImageShowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditImageShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
