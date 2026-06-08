export interface UpdateLibrarySettingRequest {
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
}