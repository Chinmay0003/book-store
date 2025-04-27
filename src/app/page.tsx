"use client";

import { useEffect, useState } from "react";
import { fetchBooks } from "@/lib/books/api"; // adjust path if needed
import { IGetAllBooksResponse } from "@/lib/books/types"; // adjust if needed
import BookCard from "@/components/ui/BookCard";

export default function Home() {
  const [books, setBooks] = useState<IGetAllBooksResponse["bookData"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;

  useEffect(() => {
    async function loadBooks() {
      const booksData = await fetchBooks();
      const unsoldBooks = booksData.bookData.filter((book) => !book.isSold);
      setBooks(unsoldBooks);
    }
    loadBooks();
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e4edfb] to-[#dcdff9] text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
          <span className="text-xl">📖</span> StoryTime Adventures
        </div>
        <div className="space-x-4">
          <button className="text-gray-600">Sign In</button>
          <button className="bg-black text-white px-4 py-2 rounded-md">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover the Magic of Reading
        </h1>
        <p className="text-lg text-gray-600">
          Interactive stories for young minds aged 0–12
        </p>

        {/* Books dynamically rendered */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {currentBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {/* Pagination Controls */}
        {books.length > booksPerPage && (
          <div className="mt-10 flex justify-center items-center gap-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-black text-white"}`}
            >
              Previous
            </button>
            <div className="font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-black text-white"}`}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="text-center py-16 bg-[#eaeafc]">
        {/* Keep your feature cards here */}
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 px-8 text-sm text-gray-600">
        {/* Keep your footer here */}
      </footer>
    </div>
  );
}
