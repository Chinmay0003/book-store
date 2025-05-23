import { fetchBooks } from "@/lib/books/api";
import { IBookData } from "@/lib/books/types";
import { useBookStore } from "@/lib/books/bookStore";

export async function ensureBooksLoaded() {
  const { books, setBooks } = useBookStore.getState();
  if (!books || books.length === 0) {
    const booksData = await fetchBooks();
    const unsoldBooks = booksData.bookData.filter((book: IBookData) => !book.isSold);
    setBooks(unsoldBooks);
    return unsoldBooks;
  }
  return books;
}
