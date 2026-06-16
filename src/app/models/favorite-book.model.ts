export interface FavoriteBook {
  id: number;
  bookId: number;
  title: string;
  author: string;
  category?: string;
  publishYear?: number;
  coverImageUrl?: string;
  createdAt: string;
}