import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { IBookData } from "@/lib/books/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isAISearchEnabled: boolean;
  setIsAISearchEnabled: (val: boolean) => void;
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
  filteredBooks: IBookData[];
  isSearching: boolean;
  loadingBookId: number | null;
  handleBookSelect: (id: number) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  isAISearchEnabled,
  setIsAISearchEnabled,
  showDropdown,
  setShowDropdown,
  filteredBooks,
  isSearching,
  loadingBookId,
  handleBookSelect,
}: SearchBarProps) {
  const router = useRouter();

  return (
    <div className="relative w-full max-w-2xl mb-10">
      <div
        className={`w-full transition-all duration-300 ${
          isAISearchEnabled ? "flame-border-glow" : ""
        }`}
      >

        <div className="relative w-full bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl px-6 py-4 transition-all duration-300">
          {/* Input Field */}
          <input
            type="text"
            placeholder={
              isAISearchEnabled
                ? "✨ Ask AI and find perfect books for your child..."
                : "Search for a book..."
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (isAISearchEnabled) {
                  console.log("AI Search:", searchQuery);
                  router.push(`/search/${encodeURIComponent(searchQuery)}?ai=true`);
                } else {
                  router.push(`/search/${encodeURIComponent(searchQuery)}?ai=false`);
                }
              }
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="w-full bg-transparent placeholder-gray-500 text-gray-800 text-lg focus:outline-none pr-12"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* AI Toggle */}
          <button
            onClick={() => setIsAISearchEnabled(!isAISearchEnabled)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium shadow-sm transition-all duration-200
              ${isAISearchEnabled
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            title={isAISearchEnabled ? "Disable AI Search" : "Enable AI Search"}
          >
            {isAISearchEnabled ? (
              <>
                <Sparkles className="w-4 h-4" />
                AI enabled
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI disabled
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {!isAISearchEnabled && showDropdown && searchQuery.trim() !== "" && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center items-center py-4">
              <LoadingSpinner size="h-8 w-8" />
            </div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <div key={book.id}>
                <div
                  className="flex items-center gap-4 px-4 py-3 hover:bg-purple-50 cursor-pointer transition"
                  onClick={() => handleBookSelect(book.id)}
                >
                  {loadingBookId === book.id && (
                    <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10 rounded-xl">
                      <LoadingSpinner size="h-8 w-8" />
                    </div>
                  )}
                  <div className={`flex items-center gap-4 ${loadingBookId === book.id ? "opacity-50" : ""}`}>
                    {book.bookMedia.find((m) => m.type === "image") ? (
                      <img
                        src={book.bookMedia.find((m) => m.type === "image")!.metadata.s3_url}
                        alt={book.name}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200" />
                    )}
                    <span className="text-gray-800 font-medium">{book.name}</span>
                  </div>
                </div>
                {index < filteredBooks.length - 1 && (
                  <hr className="mx-4 border-t border-gray-100" />
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500">No matching books found</div>
          )}
        </div>
      )}
    </div>
  );
}
