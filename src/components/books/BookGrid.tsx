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
import SearchBar from "@/components/home/SearchBar";

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
  const [isAISearchEnabled, setIsAISearchEnabled] = useState(true);
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
    "Lift and Flap": {
      img: "/liftAndFlap.jpg",
      description: "Books that inspire creativity and imagination.",
    },
    "Phonics": {
      img: "/phonics.jpg",
      description: "Books that inspire creativity and imagination.",
    },
    Toddler: {
      img: "/toddler.jpg",
      description: "Books for the youngest readers, filled with fun and discovery.",
    },
    "Touch and Feel": {
      img: "/touchAndFeel.jpg",
      description: "Books that inspire creativity and imagination.",
    },
    Playful: {
      img: "/playful.jpg",
      description: "Books that inspire creativity and imagination.",
    },
    "School Going": {
      img: "/schoolGoing.jpg",
      description: "Books that support school curricula and learning.",
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

      {/* --- DESKTOP SEARCH & FILTER --- */}
      <div className="relative w-full max-w-2xl mb-2 md:mb-10 px-2 sm:px-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isAISearchEnabled={isAISearchEnabled}
          setIsAISearchEnabled={setIsAISearchEnabled}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          filteredBooks={filteredBooks}
          isSearching={isSearching}
          loadingBookId={loadingBookId}
          handleBookSelect={handleBookSelect}
        />
      </div>

      {/* --- DESKTOP FILTERS --- */}
      <div className="flex w-full flex-col justify-start py-10 px-4 md:px-10">
        <div className="w-full flex flex-col items-center gap-2 max-w-10xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight drop-shadow-sm flex items-center justify-start mb-5 mt-5 gap-2">
            <FunnelIcon className="w-6 h-6 text-blue-600" />
            Filter by Category
          </h2>

          {/* Horizontally centered scrollable container */}
          <div className="w-full overflow-x-auto px-4">
            <div className="inline-flex gap-8 mx-auto">
              {Object.keys(bookCategories).map((category: string) => (
                <div
                  key={category}
                  className="shrink-0 transform transition-all duration-300 hover:scale-105 relative w-[280px]"
                  onClick={() => handleCategoryClick(category)}
                >
                  {loadingCategory === category && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-xl">
                      <LoadingSpinner size="h-12 w-12" />
                    </div>
                  )}
                  <div
                    className={`bg-white rounded-xl border-blue-100 shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)] ${
                      loadingCategory === category ? "opacity-50" : ""
                    }`}
                  >
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

      {/* --- TOP PICKS --- */}
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
