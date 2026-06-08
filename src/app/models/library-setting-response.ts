export interface LibrarySettingResponse {
  id: number;
  libraryName: string;
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  maxBorrowBooks: number;
  maxBorrowDays: number;
  overdueFinePerDay: number;
  allowBorrowRequest: boolean;
  libraryRules: string;
  updatedAt: string;
}