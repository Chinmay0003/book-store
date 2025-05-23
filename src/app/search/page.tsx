"use client";
import BookCard from "@/components/ui/BookCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/books/bookStore";
import { IBookData } from "@/lib/books/types";
import { ensureBooksLoaded } from "@/lib/books/bookLoader";
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  ExclamationCircleIcon,
  FunnelIcon as FilterIcon,
} from "@heroicons/react/24/outline";
import Navbar from "@/components/home/Navbar";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

// Helper for pagination dots (if needed)
function getPaginationDots(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

const PRICE_RANGES = [
  { label: "Below Rs.50", value: "below-50" },
  { label: "Rs.50 - Rs.100", value: "50-100" },
  { label: "Rs.100 - Rs.200", value: "100-200" },
  { label: "Rs.200 - Rs.300", value: "200-300" },
  { label: "More than Rs.300", value: "more-300" },
];

// Implement the price filter logic
const filterBooksByPrice = (book: IBookData, filter: string): boolean => {
  if (!filter) return true;
  const price = book.price || 0;
  switch (filter) {
    case "below-50":
      return price < 50;
    case "50-100":
      return price >= 50 && price <= 100;
    case "100-200":
      return price > 100 && price <= 200;
    case "200-300":
      return price > 200 && price <= 300;
    case "more-300":
      return price > 300;
    default:
      return true;
  }
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [books, setBooks] = useState<IBookData[]>([]);
  const [loading, setLoading] = useState(true);
  const cart = useCartStore.getState().cart;
  const [priceFilter, setPriceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    async function getBooks() {
      setLoading(true);
      try {
        let allBooks = await ensureBooksLoaded();
        // Text search
        const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean);
        let filtered = allBooks.filter((book: IBookData) =>
          searchWords.every((word) => book.name.toLowerCase().includes(word)),
        );
        // Price filter
        filtered = filtered.filter((book: IBookData) =>
          filterBooksByPrice(book, priceFilter),
        );
        setBooks(filtered);
      } catch (e) {
        setBooks([]);
      }
      setLoading(false);
    }
    getBooks();
  }, [query, priceFilter]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const booksPerPage = 8; // Changed to 8 books per page (2 rows of 4)
  const totalPages = Math.ceil(books.length / booksPerPage);
  const handlePageChange = (direction: "next" | "prev") => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;

    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }

    setCurrentPage(newPage);

    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  const handleDotClick = (page: number) => {
    if (!isAnimating && typeof page === "number") {
      setCurrentPage(page);
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.offsetWidth * (page - 1);
        carouselRef.current.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      <Navbar />
      {/* Floating Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply top-20 left-20 animate-float" />
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-50 animate-float" />
        <div className="floating-shape absolute w-64 h-64 bg-purple-100 rounded-full opacity-40 mix-blend-multiply top-40 right-32 animate-float delay-500" />
        <div className="floating-shape absolute w-32 h-32 bg-blue-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-1/3 animate-float delay-1000" />
      </div>
      <section
        id="searched-book"
        className="relative mt-0 px-2 py-10 w-full mx-auto flex flex-col items-center text-center">
        <div className="flex flex-col items-center mb-10">
          <span className="inline-flex items-center gap-2 text-blue-600 mb-2">
            <MagnifyingGlassIcon className="h-8 w-8" />
            <span className="text-3xl font-bold text-gray-800">Search Results</span>
          </span>
          <span className="text-lg text-gray-500">for "{query}"</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-10 mt-10">
          <FilterIcon className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700 font-semibold">Filter by Price:</span>
          <div className="flex gap-2">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() =>
                  setPriceFilter(priceFilter === range.value ? "" : range.value)
                }
                className={`px-5 py-3 rounded-full text-md font-semibold border shadow-sm transition-all duration-200 ${
                  priceFilter === range.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}>
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full flex flex-col items-center">
          <div className="flex items-center justify-center max-w-12xl">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1 || isAnimating}
              className={`p-2 md:p-3 rounded-full shadow-md border border-gray-200 transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                currentPage === 1 || isAnimating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous page">
              <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            {loading ? (
              <div className="flex flex-col items-center text-gray-500 mt-16">
                <BookOpenIcon className="h-12 w-12 animate-bounce mb-2 text-blue-400" />
                <span className="text-lg font-medium">Loading...</span>
              </div>
            ) : books.length === 0 ? (
              <div className="flex flex-col items-center text-gray-500 mt-16">
                <ExclamationCircleIcon className="h-12 w-12 mb-2 text-red-400" />
                <span className="text-lg font-medium">No books found.</span>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 py-2"
                style={{
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
                }}>
                {books
                  .slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)
                  .map((book) => (
                    <Link href={`/book?id=${book.id}`} key={book.id}>
                      <div
                        key={book.id}
                        className="transition-transform hover:-translate-y-1 hover:shadow-xl">
                        <BookCard book={book} cart={cart} />
                      </div>
                    </Link>
                  ))}
              </div>
            )}
            {/* Right Navigation Button */}
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages || isAnimating}
              className={`p-2 md:p-3 rounded-full shadow-md border border-gray-200 transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                currentPage === totalPages || isAnimating
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Next page">
              <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mt-8 space-x-2">
          {getPaginationDots(currentPage, totalPages).map((dot, idx) =>
            dot === "..." ? (
              <span key={"ellipsis-" + idx} className="w-4 text-center text-gray-400">
                …
              </span>
            ) : (
              <button
                key={"dot-" + idx}
                onClick={() => handleDotClick(dot as number)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  currentPage === dot
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${dot}`}
              />
            ),
          )}
        </div>
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .custom-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    </div>
  );
}
