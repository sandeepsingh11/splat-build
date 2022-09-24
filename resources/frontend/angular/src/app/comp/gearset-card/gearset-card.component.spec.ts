import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearsetCardComponent } from './gearset-card.component';

describe('GearsetCardComponent', () => {
  let component: GearsetCardComponent;
  let fixture: ComponentFixture<GearsetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearsetCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearsetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
