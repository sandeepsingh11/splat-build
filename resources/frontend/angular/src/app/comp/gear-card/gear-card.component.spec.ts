import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearCardComponent } from './gear-card.component';

describe('GearCardComponent', () => {
  let component: GearCardComponent;
  let fixture: ComponentFixture<GearCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
