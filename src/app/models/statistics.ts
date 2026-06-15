export interface ActivityStatisticsResponse {
    totalUsers: number;
    totalMembers: number;
    totalLibrarians: number;
    totalAdmins: number;
    totalActiveUsers: number;
    totalLockedUsers: number;
    totalLocalAccounts: number;
    totalGoogleAccounts: number;
    libraryName: string;
    allowBorrowRequest: boolean;
    maxBorrowBooks: number;
    maxBorrowDays: number;
    overdueFinePerDay: number;
    updatedAt: string; // ISO date string
}