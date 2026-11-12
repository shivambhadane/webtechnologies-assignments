export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  department?: string;
  createdAt?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: 'Computer Science' | 'Web Development' | 'Data Science' | 'System Architecture';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  coverImage: string;
  stock: number;
  publishedYear: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}
