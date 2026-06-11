export interface BookReview {
    id: number;
    bookId: number;
    userId: string;
    userName?: string;       // Tên người dùng (từ API trả về)
    rating: number;          // Số sao (1-5)
    comment: string;         // Nội dung bình luận
    isApproved: boolean;     // Đã được duyệt (admin)
    createdAt: string;
    updatedAt?: string;
}