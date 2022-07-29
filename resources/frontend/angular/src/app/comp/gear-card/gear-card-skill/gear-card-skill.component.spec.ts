import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearCardSkillComponent } from './gear-card-skill.component';

describe('GearCardSkillComponent', () => {
  let component: GearCardSkillComponent;
  let fixture: ComponentFixture<GearCardSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearCardSkillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearCardSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
