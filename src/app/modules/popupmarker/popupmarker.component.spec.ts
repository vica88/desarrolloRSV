import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupmarkerComponent } from './popupmarker.component';

describe('PopupmarkerComponent', () => {
  let component: PopupmarkerComponent;
  let fixture: ComponentFixture<PopupmarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupmarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupmarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
