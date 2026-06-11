export interface BorrowHistory {
  borrowTicketId: number;
  readerName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
}