import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearFormComponent } from './gear-form.component';

describe('GearFormComponent', () => {
  let component: GearFormComponent;
  let fixture: ComponentFixture<GearFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
