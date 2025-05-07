import { useState, useRef, useEffect } from "react";
import BookCard from "@/components/ui/BookCard";
import { IGetAllBooksResponse } from "@/lib/books/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface BookGridProps {
  books: IGetAllBooksResponse["bookData"];
  cart: number[];
}

function getPaginationDots(current: number, total: number) {
  // Show max 5 dots: [1, ..., current-1, current, current+1, ..., total]
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

export default function BookGrid({ books, cart }: BookGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("Playful");
  const booksPerPage = 8; // Changed to 8 books per page (2 rows of 4)
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter books based on active category
  const filteredBooks = books.filter((book) => book.category === activeFilter);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

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
    <section id="book-collection" className="relative mt-30 px-2 py-10 bg-gray-50 w-full mx-auto flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 tracking-tight drop-shadow-sm">
        Our Premium Book Collection
      </h2>
      <div className="flex gap-4 mb-8">
        {["Playful", "Toddler", "School Going"].map((label) => (
          <button
            key={label}
            onClick={() => setActiveFilter(label)}
            className={`px-6 py-2 rounded-full font-semibold shadow-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black
              ${
                activeFilter === label
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-black hover:text-white"
              }
            `}>
            {label}
          </button>
        ))}
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
          <div
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full py-2 px-2 md:px-8"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}>
            {currentBooks.map((book) => (
              <div
                key={book.id}
                className="transform transition-all duration-300 hover:scale-105"
                style={{ minWidth: "260px", maxWidth: "280px" }}>
                <div className="bg-white rounded-xl border-blue-100 shadow-[0_4px_32px_0_rgba(34,211,238,0.15)] hover:shadow-[0_8px_40px_0_rgba(34,211,238,0.25)]">
                  <BookCard book={book} cart={cart} />
                </div>
              </div>
            ))}
          </div>

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
