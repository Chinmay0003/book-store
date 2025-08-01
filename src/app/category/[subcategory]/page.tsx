"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/lib/books/bookStore";
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { FilterIcon } from "lucide-react";
import BookCard from "@/components/ui/BookCard";
import { ensureBooksLoaded } from "@/lib/books/bookLoader";
import { IBookData } from "@/lib/books/types";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function getPaginationDots(current: number, total: number) {
  // Show max 5 dots: [1, ..., current-1, current, current+1, ..., total]
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

const filterBooksByPrice = (book: IBookData, filter: string): boolean => {
  const price = book.price;
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
const SubcategoryPage = () => {
  const params = useParams<{ subcategory: string }>();
  const subcategory = decodeURIComponent(params.subcategory);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [books, setBooks] = useState<IBookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loadingBookId, setLoadingBookId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);
  useEffect(() => {
    async function getBooks() {
      setLoading(true);
      let allBooks = await ensureBooksLoaded();
      try {
        const filteredBooks = allBooks.filter(
          (book) =>
            (book.category === subcategory || String(book.contentCategory).includes(subcategory)) && filterBooksByPrice(book, priceFilter),
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
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const router = useRouter();
  const handleBookSelect = (bookId: number) => {
    setLoadingBookId(bookId);
    router.push(`/book?id=${bookId}`);
    setShowDropdown(false);
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
        id="book-collection"
        className="relative mt-0 px-2 py-10 w-full mx-auto flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 tracking-tight drop-shadow-sm">
          Our Premium Book Collection
        </h2>
        {/* Search Bar */}
        <div className="relative w-full max-w-xl mb-8 z-1000">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search or type a book name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push(`/search/${encodeURIComponent(searchQuery)}`);
              }
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="w-full pl-12 pr-12 py-3 rounded-full shadow-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg z-1000"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-all duration-200 group">
              <div className="absolute -inset-1 rounded-full bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 relative z-10">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Dropdown */}
          {showDropdown && searchQuery.trim() !== "" && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-md max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center items-center py-4">
                  <LoadingSpinner size="h-8 w-8" />
                </div>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <div key={book.id}>
                    <div
                      className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 cursor-pointer text-left text-gray-700 font-semibold transition-all duration-150"
                      onClick={() => handleBookSelect(book.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleBookSelect(book.id);
                        }
                      }}>
                      {loadingBookId === book.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-xl">
                          <LoadingSpinner size="h-8 w-8" />
                        </div>
                      )}
                      <div
                        className={`flex items-center gap-4 ${
                          loadingBookId === book.id ? "opacity-50" : ""
                        }`}>
                        {book.bookMedia.filter((e) => e.type === "image").length > 0 ? (
                          <img
                            src={
                              book.bookMedia.filter((e) => e.type === "image")[0]
                                .metadata.s3_url
                            }
                            // alt={book.name}
                            className="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200"></div>
                        )}
                        <span>{book.name}</span>
                      </div>
                    </div>
                    {index < filteredBooks.length - 1 && (
                      <hr className="mx-4 border-t border-gray-200" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">No matching books found</div>
              )}
            </div>
          )}
        </div>

        <div className="w-full flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight drop-shadow-sm mt-5 mb-5">
            Product by category {subcategory}
          </h2>

          {/* Price Filter Dropdown */}
          <div className="flex items-center justify-center gap-3 mb-10 mt-10 z-999 relative">
            <FilterIcon className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 font-semibold">Filter by Price:</span>
            {/* Desktop buttons */}
            <div className="hidden md:flex flex-wrap justify-center gap-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() =>
                    setPriceFilter(priceFilter === range.value ? "" : range.value)
                  }
                  className={`px-4 py-2 md:px-5 md:py-3 rounded-full text-sm md:text-md font-semibold border shadow-sm transition-all duration-200 ${
                    priceFilter === range.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`}>
                  {range.label}
                </button>
              ))}
            </div>
            {/* Mobile dropdown */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-2 py-2 rounded-full text-sm font-semibold border shadow-sm bg-white text-gray-800 border-gray-300 hover:bg-gray-100 w-48 text-left flex justify-between items-center">
                <span>
                  {PRICE_RANGES.find((r) => r.value === priceFilter)?.label ||
                    "All Prices"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showFilterDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {showFilterDropdown && (
                <div className="absolute z-20 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-md">
                  <button
                    onClick={() => {
                      setPriceFilter("");
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      !priceFilter
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}>
                    All Prices
                  </button>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setPriceFilter(range.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        priceFilter === range.value
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}>
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex-col justify-start px-2 sm:px-2 md:px-10">
            <div className="flex items-center justify-center max-w-12xl">
              {/* Left Navigation Button */}
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1 || isAnimating}
                className={`hidden md:flex p-2 md:p-3 rounded-full shadow-md border border-gray-200 transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  currentPage === 1 || isAnimating
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 w-full py-2 md:px-8"
                  style={{
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                  }}>
                  {books
                    .slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)
                    .map((book) => (
                      <div
                        key={book.id}
                        className="transform transition-all duration-300 hover:scale-105">
                        <Link href={`/book?id=${book.id}`} key={book.id}>
                          <div
                            className="bg-white rounded-xl border-blue-100 shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)] relative"
                            onClick={() => setLoadingBookId(book.id)}>
                            {loadingBookId === book.id && (
                              <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-xl">
                                <LoadingSpinner size="h-12 w-12" />
                              </div>
                            )}
                            <div
                              className={loadingBookId === book.id ? "opacity-50" : ""}>
                              <BookCard book={book} cart={carts} />
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              )}

              {/* Right Navigation Button */}
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages || isAnimating}
                className={`hidden md:flex p-2 md:p-3 rounded-full shadow-md border border-gray-200 transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
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
          <div className="hidden md:flex items-center justify-center mt-8 space-x-2">
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
          {totalPages > 1 && (
            <div className="flex md:hidden items-center justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1 || isAnimating}
                className="px-4 py-2 rounded-full font-semibold border shadow-sm transition-all duration-200 bg-black text-white border-black hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                Prev
              </button>
              {getPaginationDots(currentPage, totalPages).map((dot, idx) =>
                dot === "..." ? (
                  <span key={"ellipsis-mobile-" + idx} className="w-4 text-center text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={"dot-mobile-" + idx}
                    onClick={() => handleDotClick(dot as number)}
                    className={`w-8 h-8 rounded-full transition-all duration-300 focus:outline-none ${
                      currentPage === dot
                        ? "bg-blue-600 text-white scale-110"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}>
                    {dot}
                  </button>
                ),
              )}
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages || isAnimating}
                className="px-4 py-2 rounded-full font-semibold border shadow-sm transition-all duration-200 bg-black text-white border-black hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
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
};

export default SubcategoryPage;
