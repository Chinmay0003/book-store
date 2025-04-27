import { BookCategory, BookQuality, BookType } from "@/lib/books/enums";

export interface IBookMediaResponse {
  id: number;
  metadata: {
    s3_key: string;
    s3_url: string;
    mime_type: string;
  }[];
  type: "image" | "video";
}

export interface IGetAllBooksResponse {
  bookData: {
    id: number;
    name: string;
    category: BookCategory;
    isSold: boolean;
    price: number;
    quality: BookQuality;
    type: BookType;
    bookMedia: IBookMediaResponse[];
  };
}
