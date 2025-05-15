"use client";

import { useEffect, useState } from "react";
import { fetchBooks } from "@/lib/books/api";
import { IGetAllBooksResponse } from "@/lib/books/types";
import { authUser, redirectToSignin } from "@/lib/auth/api";
import { addBookToCart, fetchActiveCart, updateCartWithBooks } from "@/lib/cart/api";
import { User } from "@/types/user";
import { useBookStore, useCartStore } from "@/lib/books/bookStore";

// Components
import Hero from "@/components/home/Hero";
import BookGrid from "@/components/books/BookGrid";
import Features from "@/components/home/Features";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const { books, setBooks } = useBookStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const { cart, setCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      url.searchParams.delete("token");
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  useEffect(() => {
    async function loadBooks() {
      if (books.length > 0) {
        setIsLoading(false);
        return;
      }
      console.log("Loading books...");
      try {
        const booksData = await fetchBooks();
        const unsoldBooks = booksData.bookData.filter((book) => !book.isSold);
        setBooks(unsoldBooks);
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
      }
    }
    loadBooks();
  }, [books, setBooks]);

  useEffect(() => {
    const fetchUserAndCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        console.log("Fetching user and cart...", token);
        const userData = await authUser(token);
        setUser(userData);
        console.log("User data:", userData);

        const cartBooks = await fetchActiveCart(token);
        if (cartBooks) {
          const updatedCart = cartBooks
            .filter((book) => book.isSold === false)
            .map((book) => book.id);
          setCart(updatedCart);
        }
      } catch (err) {
        console.error("Error fetching user or cart", err);
      }
    };

    fetchUserAndCart();
  }, [cart, setCart]);

  const handleSignIn = () => {
    window.location.href = redirectToSignin();
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="w-full bg-white">
      <Hero
        userInfo={user as any}
        handleSign={handleSignIn}
        handleSignOut={handleSignOut}
      />

      <div className="flex justify-center items-center min-h-[400px] mt-[-2rem]">
        {isLoading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        ) : (
          <BookGrid books={filteredBooks} cart={cart} />
        )}
      </div>
      <Features />
      <Footer />
    </div>
  );
}
