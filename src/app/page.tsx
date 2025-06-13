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

function getPaginationDots(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

export default function Home() {
  const { books, setBooks } = useBookStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const { cart, setCart, setUnpaidBlockedCart, initializeCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

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
        const cartBooks = (await fetchActiveCart(token));
        if (cartBooks) {
          const updatedCart = cartBooks.books
            .filter((book) => book.isSold === false)
            .map((book) => book.id);
          setCart(updatedCart);
          const updatedBlockedCart = (cartBooks.unpaidBlockedCart ?? []).map(e=>e.id);
          setUnpaidBlockedCart(updatedBlockedCart);
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

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1),
    );
  };

  const handleDotClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full bg-white">
      <Hero />

      <div className="flex justify-center items-center min-h-[400px] mt-[-2rem]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <BookGrid
            books={filteredBooks}
            cart={cart}
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            handleDotClick={handleDotClick}
          />
        )}
      </div>
      <Features />
      <Footer />
    </div>
  );
}
