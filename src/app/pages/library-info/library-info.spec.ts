import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryInfo } from './library-info';

describe('LibraryInfo', () => {
  let component: LibraryInfo;
  let fixture: ComponentFixture<LibraryInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
