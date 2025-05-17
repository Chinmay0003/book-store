import { AuthStore, IBookData } from "@/lib/books/types";
import { create } from "zustand";
import { authUser, redirectToSignin } from "@/lib/auth/api";
import { fetchActiveCart, updateCartWithBooks } from "@/lib/cart/api";

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
  addToCart: (bookId: number) => void;
  removeFromCart: (bookId: number) => void;
  initializeCart: () => Promise<void>;
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
  removingItemId: null,

  setCart: (cart) => set({ cart }),
  setRemovingItemId: (id) => set({ removingItemId: id }),

  addToCart: async (bookId) => {
    const currentCart = get().cart;
    if (!currentCart.includes(bookId)) {
      const updatedCart = [...currentCart, bookId];
      set({ cart: updatedCart });

      // Sync with server
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await updateCartWithBooks(updatedCart, token);
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      }
    }
  },

  removeFromCart: async (bookId) => {
    const currentCart = get().cart;
    const updatedCart = currentCart.filter((id) => id !== bookId);
    set({ cart: updatedCart });

    // Sync with server
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await updateCartWithBooks(updatedCart, token);
      } catch (error) {
        console.error("Error syncing cart:", error);
      }
    }
  },

  initializeCart: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const cartBooks = await fetchActiveCart(token);
        const cart = cartBooks ? cartBooks.map((b) => b.id) : [];
        set({ cart });
      } catch (error) {
        console.error("Error initializing cart:", error);
      }
    }
  },
}));

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  cart: [],
  isLoading: true,

  setUser: (user) => set({ user }),
  setCart: (cart) => set({ cart }),

  handleSignIn: () => {
    window.location.href = redirectToSignin();
  },

  handleSignOut: () => {
    localStorage.removeItem("token");
    set({ user: null, cart: [] });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const user = await authUser(token);
      const cartBooks = await fetchActiveCart(token) ?? [];
      const cart = cartBooks
        .filter((book) => book.isSold === false)
        .map((book) => book.id.toString());

      set({ user, cart, isLoading: false });

      // Initialize cart in CartStore as well
      useCartStore.getState().initializeCart();
    } catch (err) {
      console.error("Error initializing auth:", err);
      set({ user: null, cart: [], isLoading: false });
    }
  },
}));
