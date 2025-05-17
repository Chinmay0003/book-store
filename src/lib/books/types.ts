import { BookCategory, BookQuality, BookType } from "@/lib/books/enums";
import { User } from "@/types/user";

export interface IBookMediaResponse {
  id: number;
  metadata: {
    s3_key: string;
    s3_url: string;
    mime_type: string;
  };
  type: "image" | "video";
}

export interface IBookData {
  id: number;
  name: string;
  category: BookCategory;
  isSold: boolean;
  price: number;
  quality: BookQuality;
  type: BookType;
  bookMedia: IBookMediaResponse[];
}

export interface IGetAllBooksResponse {
  bookData: IBookData[];
}

export interface AuthStore {
  user: User | null;
  cart: string[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setCart: (cart: string[]) => void;
  handleSignIn: () => void;
  handleSignOut: () => void;
  initializeAuth: () => Promise<void>;
}