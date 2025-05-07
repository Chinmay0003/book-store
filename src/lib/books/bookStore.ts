import { IBookData } from "@/lib/books/types";
import { create } from "zustand";

interface BookStoreState {
  selectedBook: IBookData | null;
  setSelectedBook: (book: IBookData) => void;
  clearSelectedBook: () => void;
  books: IBookData[];
  setBooks: (books: IBookData[]) => void;
}

interface CartStoreState {
  cart: number[];
  setCart: (cart: number[]) => void;
  removingItemId: number | null;
  setRemovingItemId: (id: number | null) => void;
}

export const useBookStore = create<BookStoreState>((set) => ({
  selectedBook: null,
  setSelectedBook: (book) => set({ selectedBook: book }),
  clearSelectedBook: () => set({ selectedBook: null }),
  books: [],
  setBooks: (books) => set({ books }),
}));

export const useCartStore = create<CartStoreState>((set, get) => ({
  cart: [],
  setCart: (cart) => set({ cart }),
  removingItemId: null,
  setRemovingItemId: (id) => set({ removingItemId: id }),
}));
