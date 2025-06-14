import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BookCard from "@/components/ui/BookCard";
import { IGetAllBooksResponse } from "@/lib/books/types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import BookCategory from "../ui/BookCategory";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../ui/LoadingSpinner";

interface BookGridProps {
  books: IGetAllBooksResponse["bookData"];
  cart: number[];
  totalPages?: number;
  currentPage?: number;
  handlePageChange?: (direction: "next" | "prev") => void;
  handleDotClick?: (page: number) => void;
}

function getPaginationDots(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

export default function BookGrid({
  books,
  cart,
  totalPages: totalPagesProp,
  currentPage: currentPageProp,
  handlePageChange: handlePageChangeProp,
  handleDotClick: handleDotClickProp,
}: BookGridProps) {
  const [currentPage, setCurrentPage] = useState(currentPageProp ?? 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [loadingBookId, setLoadingBookId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const booksPerPage = 8; // Changed to 8 books per page (2 rows of 4)
  const carouselRef = useRef<HTMLDivElement>(null);
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
    if (currentPageProp) {
      setCurrentPage(currentPageProp);
    }
  }, [currentPageProp]);
  const totalPages = totalPagesProp ?? Math.ceil(books.length / booksPerPage);
  const handlePageChange =
    handlePageChangeProp ??
    ((direction: "next" | "prev") => {
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
    });

  const handleDotClick =
    handleDotClickProp ??
    ((page: number) => {
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
    });

  const bookCategories: Record<string, { img: string; description: string }> = {
    Playful: {
      img: "/playful.jpg",
      description: "Books that inspire creativity and imagination.",
    },
    "School Going": {
      img: "/schoolGoing.jpg",
      description: "Books that support school curricula and learning.",
    },
    Toddler: {
      img: "/toddler.jpg",
      description: "Books for the youngest readers, filled with fun and discovery.",
    },
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    setLoadingCategory(category);
    router.push(`/category/${encodeURIComponent(category)}`);
  };

  const handleBookSelect = (bookId: number) => {
    setLoadingBookId(bookId);
    router.push(`/book?id=${bookId}`);
    setShowDropdown(false);
  };
  return (
    <section
      id="book-collection"
      className="relative mt-0 px-4 md:px-2 py-10 bg-gray-50 w-full mx-auto flex flex-col items-center text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-gray-800 tracking-tight drop-shadow-sm">
        Our Premium Book Collection
      </h2>

      {/* --- MOBILE SEARCH & FILTER --- */}
      <div className="md:hidden w-full px-4 mb-6">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-grow">
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
              className="w-full pl-10 pr-10 py-2 rounded-full shadow-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            {/* Dropdown for mobile */}
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
                          {book.bookMedia.filter((e) => e.type === "image").length >
                          0 ? (
                            <img
                              src={
                                book.bookMedia.filter((e) => e.type === "image")[0]
                                  .metadata.s3_url
                              }
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
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="p-3 rounded-full shadow-md border border-gray-200 bg-white">
            <FunnelIcon className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* --- DESKTOP SEARCH --- */}
      <div className="hidden md:block relative w-full max-w-md md:max-w-xl mb-8">
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
          className="w-full pl-10 pr-10 py-2 md:pl-12 md:pr-12 md:py-3 rounded-full shadow-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base md:text-lg"
        />
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
                            book.bookMedia.filter((e) => e.type === "image")[0].metadata
                              .s3_url
                          }
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

      {/* --- MOBILE FILTERS (conditionally rendered) --- */}
      {showFilters && (
        <div className="md:hidden w-full mb-4 px-1">
          <div className="flex flex-row justify-between items-center">
            {Object.keys(bookCategories).map((category) => (
              <div
                key={category}
                className="w-[31%] transform transition-all duration-150 relative"
                onClick={() => handleCategoryClick(category)}>
                {loadingCategory === category && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-md">
                    <LoadingSpinner size="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`bg-white rounded-md p-1 border border-gray-100 shadow-sm ${
                    loadingCategory === category ? "opacity-50" : ""
                  }`}>
                  <div className="aspect-square w-full relative overflow-hidden rounded">
                    <Image
                      src={bookCategories[category].img}
                      alt={category}
                      fill
                      objectFit="cover"
                      className="object-cover transition-opacity duration-300 group-hover:opacity-60"
                      priority
                    />
                  </div>
                  <p className="text-[10px] font-medium text-gray-700 mt-1 truncate">
                    {category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- DESKTOP FILTERS --- */}
      <div className="hidden md:flex w-full flex-col justify-start py-10 px-4 md:px-10">
        <div className="w-full flex flex-col items-center gap-2 max-w-10xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight drop-shadow-sm flex items-center justify-start mb-5 mt-5 gap-2">
            <FunnelIcon className="w-6 h-6 text-blue-600" />
            Filter by Age group
          </h2>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {Object.keys(bookCategories).map((category: string) => (
                <div
                  key={category}
                  className="transform transition-all duration-300 hover:scale-105 relative w-[280px]"
                  onClick={() => handleCategoryClick(category)}>
                  {loadingCategory === category && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-xl">
                      <LoadingSpinner size="h-12 w-12" />
                    </div>
                  )}
                  <div
                    className={`bg-white rounded-xl border-blue-100 shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)] ${
                      loadingCategory === category ? "opacity-50" : ""
                    }`}>
                    <BookCategory
                      category={category}
                      img={bookCategories[category].img}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-col justify-start px-2 sm:px-4 md:px-10">
        <div className="relative w-full flex flex-col items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight drop-shadow-sm flex items-center justify-center max-w-10xl mb-5 mt-5 gap-2">
            <StarIcon className="w-6 h-6 text-yellow-500" />
            Top Picks of the Day
          </h2>
          <div className="flex w-full items-center justify-center max-w-12xl">
            {/* Left Navigation Button */}
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1 || isAnimating}
              className={`hidden md:flex p-2 md:p-3 rounded-full shadow-md border border-gray-200 transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                currentPage === 1 || isAnimating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous page">
              <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Grid Container */}
            <div
              ref={carouselRef}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full py-2 px-1 md:px-8"
              style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}>
              {(handlePageChangeProp ? books : filteredBooks)
                .slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)
                .map((book) => (
                  <Link href={`/book?id=${book.id}`} key={book.id}>
                    <div
                      className="transform transition-all duration-300 hover:scale-105 relative"
                      onClick={() => setLoadingBookId(book.id)}>
                      {loadingBookId === book.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-xl">
                          <LoadingSpinner size="h-12 w-12" />
                        </div>
                      )}
                      <div className={loadingBookId === book.id ? "opacity-50" : ""}>
                        <BookCard book={book} cart={cart} />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

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

        {/* Mobile-only "Next Page" button */}
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
                <span
                  key={"ellipsis-mobile-" + idx}
                  className="w-4 text-center text-gray-400">
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
}
