import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowRequest } from './borrow-request';

describe('BorrowRequest', () => {
  let component: BorrowRequest;
  let fixture: ComponentFixture<BorrowRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(BorrowRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
