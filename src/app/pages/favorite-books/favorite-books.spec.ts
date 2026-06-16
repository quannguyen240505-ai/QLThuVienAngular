import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBooks } from './favorite-books';

describe('FavoriteBooks', () => {
  let component: FavoriteBooks;
  let fixture: ComponentFixture<FavoriteBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteBooks],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
