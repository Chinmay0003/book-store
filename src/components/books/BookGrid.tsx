import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import BookCard from "@/components/ui/BookCard";
import { IGetAllBooksResponse } from "@/lib/books/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface BookGridProps {
  books: IGetAllBooksResponse["bookData"];
  cart: number[];
}

function getPaginationDots(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

export default function BookGrid({ books, cart }: BookGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const booksPerPage = 8;
  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const router = useRouter();


  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section
      id="book-collection"
      className="relative mt-0 px-2 py-10 bg-gray-50 w-full mx-auto flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 tracking-tight drop-shadow-sm">
        Our Premium Book Collection
      </h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-xl mb-8">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
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
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className="w-full pl-12 pr-12 py-3 rounded-full shadow-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-all duration-200 group"
          >
            <div className="absolute -inset-1 rounded-full bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 relative z-10"
            >
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
            {filteredBooks.map((book, index) => (
              <div key={book.id}>
                <div
                  className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 cursor-pointer text-left text-gray-700 font-semibold transition-all duration-150"
                  onMouseDown={() => {
                    router.push(`/book?id=${book.id}`);
                    setShowDropdown(false); // Close the dropdown on click
                  }}
                >
                  {book.bookMedia.filter(e=>e.type==="image").length > 0 ? (
                    <img
                      src={book.bookMedia.filter(e=>e.type==="image")[0].metadata.s3_url}
                      // alt={book.name}
                      className="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200"></div>
                  )}
                  <span>{book.name}</span>
                </div>
                {index < books.length - 1 && (
                  <hr className="mx-4 border-t border-gray-200" />
                )}
              </div>
            ))}
            {books.length === 0 && (
              <div className="px-4 py-3 text-gray-500">No matching books found</div>
            )}
          </div>
        )}

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

          <div
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full py-2 px-2 md:px-8"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}>
            {books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage).map((book) => (
              <Link href={`/book?id=${book.id}`} key={book.id}>
                <div className="transform transition-all duration-300 hover:scale-105">
                  <BookCard book={book} cart={cart} />
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === Math.ceil(books.length / booksPerPage) || isAnimating}
            className={`p-2 md:p-3 rounded-full shadow-md border border-gray-200 transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              currentPage === Math.ceil(books.length / booksPerPage) || isAnimating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next page">
            <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}