import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShowPanelComponent } from './edit-show-panel.component';

describe('EditShowPanelComponent', () => {
  let component: EditShowPanelComponent;
  let fixture: ComponentFixture<EditShowPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShowPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShowPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
