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
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import dynamic from "next/dynamic";

const Features = dynamic(() => import("@/components/home/Features"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export default function Home() {
  const { books, setBooks } = useBookStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const { cart, setCart, initializeCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [visibleBooks, setVisibleBooks] = useState(8);

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

  const handleLoadMore = () => {
    setVisibleBooks((prev) => prev + 8);
  };
  return (
    <div className="w-full bg-white">
      <Hero />

      <div className="flex justify-center items-center min-h-[400px] mt-[-2rem]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <BookGrid books={filteredBooks.slice(0, visibleBooks)} cart={cart} />
        )}
      </div>
      {visibleBooks < filteredBooks.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
      <Features />
      <Footer />
    </div>
  );
}
