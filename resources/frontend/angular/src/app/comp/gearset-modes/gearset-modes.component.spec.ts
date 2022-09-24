import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearsetModesComponent } from './gearset-modes.component';

describe('GearsetModesComponent', () => {
  let component: GearsetModesComponent;
  let fixture: ComponentFixture<GearsetModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearsetModesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearsetModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
