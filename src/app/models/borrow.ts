export interface BorrowBookItem {
  bookId: number;
  quantity: number;
}

export interface BorrowRequest {
  dueDate: string;
  note?: string;
  books: BorrowBookItem[];
}