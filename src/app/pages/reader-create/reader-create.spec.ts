import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderCreate } from './reader-create';

describe('ReaderCreate', () => {
  let component: ReaderCreate;
  let fixture: ComponentFixture<ReaderCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
