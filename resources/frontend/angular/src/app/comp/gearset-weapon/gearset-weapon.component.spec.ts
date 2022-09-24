import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearsetWeaponComponent } from './gearset-weapon.component';

describe('GearsetWeaponComponent', () => {
  let component: GearsetWeaponComponent;
  let fixture: ComponentFixture<GearsetWeaponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearsetWeaponComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearsetWeaponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
