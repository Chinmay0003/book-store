import { BookCategory, BookQuality, BookType } from "@/lib/books/enums";

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
