import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book';

@Injectable({ providedIn: 'root' })
export class SelectedBookService {
    private selectedBookSubject = new BehaviorSubject<Book | null>(null);
    selectedBook$ = this.selectedBookSubject.asObservable();

    setSelectedBook(book: Book): void {
        this.selectedBookSubject.next(book);
    }

    clearSelectedBook(): void {
        this.selectedBookSubject.next(null);
    }
}