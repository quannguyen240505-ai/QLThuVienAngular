export interface Book {
    id: number;
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publishYear?: number;
    category?: string;
    description?: string;
    totalCopies: number;
    availableCopies: number;
    isActive: boolean;
    createdAt: Date;
    coverImageUrl?: string;
}