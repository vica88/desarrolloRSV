import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDragDropComponent } from './dialog-drag-drop.component';

describe('DialogDragDropComponent', () => {
  let component: DialogDragDropComponent;
  let fixture: ComponentFixture<DialogDragDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDragDropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
