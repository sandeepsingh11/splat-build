import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillBubbleComponent } from './skill-bubble.component';

describe('SkillBubbleComponent', () => {
  let component: SkillBubbleComponent;
  let fixture: ComponentFixture<SkillBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
