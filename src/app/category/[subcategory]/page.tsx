"use client";
import React, { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { useBookStore, useCartStore } from "@/lib/books/bookStore";
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { FilterIcon } from "lucide-react";
import BookCard from "@/components/ui/BookCard";
import { ensureBooksLoaded } from "@/lib/books/bookLoader";
import { IBookData } from "@/lib/books/types";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface PageProps {
  params: { subcategory: string };
}

function getPaginationDots(current: number, total: number) {
  // Show max 5 dots: [1, ..., current-1, current, current+1, ..., total]
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}
const SubcategoryPage = ({ params }: PageProps) => {
  // Decode subcategory to handle URL-encoded spaces (e.g., %20)
  const subcategory = decodeURIComponent(params.subcategory);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<IBookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<string>("");
  const priceRanges = [
    { label: "Below Rs.50", value: "below-50" },
    { label: "Rs.50 - Rs.100", value: "50-100" },
    { label: "Rs.100 - Rs.200", value: "100-200" },
    { label: "Rs.200 - Rs.300", value: "200-300" },
    { label: "More than Rs.300", value: "more-300" },
  ];
  function filterByPrice(book: IBookData) {
    const price = book.price;
    switch (priceFilter) {
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
  }

  useEffect(() => {
    async function getBooks() {
      setLoading(true);
      let allBooks = await ensureBooksLoaded();
      try {
        const filteredBooks = allBooks.filter(
          (book) => book.category === subcategory && filterByPrice(book),
        );
        setBooks(filteredBooks);
      } catch (e) {
        setBooks([]);
      }
      setLoading(false);
    }
    getBooks();
  }, [subcategory, priceFilter]);
  const carts = useCartStore.getState().cart;

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
  const searchBook = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search term:", e.target.value);
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  return (
    <section
      id="book-collection"
      className="relative mt-0 px-2 py-10 bg-gray-50 w-full mx-auto flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 tracking-tight drop-shadow-sm">
        Our Premium Book Collection
      </h2>
      <div className="w-full max-w-md mb-8 relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          onChange={searchBook}
          value={searchTerm}
          type="text"
          placeholder="Search for a book..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-blue-400 shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)] placeholder-gray-400 text-black fp focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
            }
          }}
        />
      </div>

      <div className="w-full flex-col justify-start px-10">
        <div className="w-full flex justify-start mb-4 px-10">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
            Product by category {subcategory}
          </h2>
        </div>
        {/* Price Filter Dropdown */}
        <div className="w-full flex items-center justify-start mb-6 px-10 gap-2">
          <span className="flex items-center text-blue-500 bg-blue-50 rounded-full p-2 mr-1">
            <FilterIcon className="w-5 h-5" />
          </span>
          <label htmlFor="price-filter" className="mr-2 font-semibold text-gray-700">
            Filter
          </label>
          <select
            id="price-filter"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="border border-blue-200 rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition hover:bg-blue-50">
            <option value="">All Prices</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-full flex flex-col items-center">
          <div className="flex items-center justify-center max-w-12xl">
            {/* Left Navigation Button */}
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1 || isAnimating}
              className={`p-2 md:p-3 rounded-full shadow-md border border-gray-200 transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                currentPage === 1 || isAnimating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous page">
              <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Grid Container */}

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
                ref={carouselRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full py-2 px-2 md:px-8"
                style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}>
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="transform transition-all duration-300 hover:scale-105"
                    style={{ minWidth: "260px", maxWidth: "280px" }}>
                    <div className="bg-white rounded-xl border-blue-100 shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)]">
                      <BookCard book={book} cart={carts} />
                    </div>
                  </div>
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

        {/* Pagination Indicator */}
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
  );
};

export default SubcategoryPage;
