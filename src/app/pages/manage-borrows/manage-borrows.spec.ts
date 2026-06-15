import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBorrows } from './manage-borrows';

describe('ManageBorrows', () => {
  let component: ManageBorrows;
  let fixture: ComponentFixture<ManageBorrows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBorrows],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageBorrows);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
