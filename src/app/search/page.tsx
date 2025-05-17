"use client";
import BookCard from "@/components/ui/BookCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/books/bookStore";
import { IBookData } from "@/lib/books/types";
import { ensureBooksLoaded } from "@/lib/books/bookLoader";
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  ExclamationCircleIcon,
  FunnelIcon as FilterIcon,
} from "@heroicons/react/24/outline";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [books, setBooks] = useState<IBookData[]>([]);
  const [loading, setLoading] = useState(true);
  const cart = useCartStore.getState().cart;
  const [priceFilter, setPriceFilter] = useState("");
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
        let filtered = allBooks.filter((book: IBookData) => {
          const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean);
          return searchWords.every((word) => book.name.toLowerCase().includes(word));
        });
        filtered = filtered.filter(filterByPrice);
        setBooks(filtered);
      } catch (e) {
        setBooks([]);
      }
      setLoading(false);
    }
    getBooks();
  }, [query, priceFilter]);

  return (
    <section className="px-4 py-12 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center mb-10">
        <span className="inline-flex items-center gap-2 text-blue-600 mb-2">
          <MagnifyingGlassIcon className="h-8 w-8" />
          <span className="text-3xl font-bold text-gray-800">Search Results</span>
        </span>
        <span className="text-lg text-gray-500">for "{query}"</span>
      </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 py-2">
          {books.map((book: any) => (
            <div
              key={book.id}
              className="transition-transform hover:-translate-y-1 hover:shadow-xl">
              <BookCard book={book} cart={cart} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
