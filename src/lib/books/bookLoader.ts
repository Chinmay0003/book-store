import { fetchBooks } from "@/lib/books/api";
import { IBookData } from "@/lib/books/types";
import { useBookStore, useCartStore } from "@/lib/books/bookStore";

export async function ensureBooksLoaded() {
  const { books, setBooks } = useBookStore.getState();
  const {setAllBooksData} = useCartStore.getState();
  if (!books || books.length === 0) {
    const booksData = await fetchBooks();
    setAllBooksData(booksData.bookData);
    const unsoldBooks = booksData.bookData.filter((book: IBookData) => !book.isSold);
    setBooks(unsoldBooks);
    return unsoldBooks;
  }
  return books;
}
