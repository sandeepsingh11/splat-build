import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatEffectComponent } from './stat-effect.component';

describe('StatEffectComponent', () => {
  let component: StatEffectComponent;
  let fixture: ComponentFixture<StatEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatEffectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
