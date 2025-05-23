"use client";
import { useEffect, useState } from "react";
import { authUser } from "@/lib/auth/api";
import { fetchActiveCart } from "@/lib/cart/api";
import { User } from "@/types/user";
import { useBookStore, useCartStore } from "@/lib/books/bookStore";
import { ensureBooksLoaded } from "@/lib/books/bookLoader";

// Components
import Hero from "@/components/home/Hero";
import BookGrid from "@/components/books/BookGrid";
import Features from "@/components/home/Features";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const { books, setBooks } = useBookStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const { cart, setCart, initializeCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  // Handle token in URL for initial login
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      url.searchParams.delete("token");
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  // Load books on initial mount
  useEffect(() => {
    async function loadBooks() {
      setIsLoading(true);
      await ensureBooksLoaded();
      setIsLoading(false);
    }
    loadBooks();
  }, [setBooks]);

  useEffect(() => {
    const initializeUserAndCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        console.log("Fetching user and cart...", token);
        const userData = await authUser(token);
        setUser(userData);
        console.log("User data:", userData);

        // Always replace cart with server cart — do NOT merge to avoid duplicates
        const cartBooks = await fetchActiveCart(token);
        if (cartBooks) {
          const updatedCart = cartBooks
            .filter((book) => book.isSold === false)
            .map((book) => book.id);
          setCart(updatedCart);
        } else {
          setCart([]);
        }
      } catch (err) {
        console.error("Error fetching user or cart", err);
      }
    };

    initializeUserAndCart();
  }, [setCart]);

  const filteredBooks = books
    .filter((book) => book.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return (
    <div className="w-full bg-white">
      <Hero />

      <div className="flex justify-center items-center min-h-[400px] mt-[-2rem]">
        {isLoading ? (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply top-20 left-20 animate-float" />
            <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-50 animate-float" />
            <div className="floating-shape absolute w-64 h-64 bg-purple-100 rounded-full opacity-40 mix-blend-multiply top-40 right-32 animate-float delay-500" />
            <div className="floating-shape absolute w-32 h-32 bg-blue-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-1/3 animate-float delay-1000" />
          </div>
        ) : (
          <BookGrid books={filteredBooks} cart={cart} />
        )}
      </div>
      <Features />
      <Footer />
    </div>
  );
}
