import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginSuccess } from './social-login-success';

describe('SocialLoginSuccess', () => {
  let component: SocialLoginSuccess;
  let fixture: ComponentFixture<SocialLoginSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLoginSuccess],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLoginSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
