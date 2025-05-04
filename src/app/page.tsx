"use client"

import { useEffect, useState } from "react";
import { Search } from "lucide-react"; // for search icon
import Image from "next/image";
import { fetchBooks } from "@/lib/books/api"; // adjust path if needed
import { IGetAllBooksResponse } from "@/lib/books/types"; // adjust if needed
import BookCard from "@/components/ui/BookCard";

export default function Home() {
  const [books, setBooks] = useState<IGetAllBooksResponse["bookData"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategories.length === 0 || selectedCategories.includes(book.category))
  );  
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    photoUrl?: string;
  }>(null);

  const API_BASE = "http://localhost:4000";

  // ✅ Store token if returned from backend
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      url.searchParams.delete("token");
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  // ✅ Load books from backend
  useEffect(() => {
    async function loadBooks() {
      const booksData = await fetchBooks();
      const unsoldBooks = booksData.bookData.filter((book) => !book.isSold);
      setBooks(unsoldBooks);
    }
    loadBooks();
  }, []);

  // ✅ Fetch user data using stored token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      console.log(token);

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const userData = await res.json();
        console.log(userData);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };

    fetchUser();
  }, []);

  // ✅ Initiate Google sign-in
  const handleSignIn = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const categories = Array.from(new Set(books.map((b) => b.category)));

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

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category) // remove if already selected
        : [...prev, category] // add if not selected
    );
    setCurrentPage(1);
  };  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e4edfb] to-[#dcdff9] text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
          <span className="text-xl">📖</span> StoryTime Adventures
        </div>
        <div className="space-x-4 flex items-center gap-3">
          {user ? (
            <>
              {user.photoUrl && (
                <Image
                  src={user.photoUrl}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  // priority // optional, if user avatar is high-priority
                />              
              )}
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={handleSignOut}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSignIn} className="text-gray-600">
                Sign In
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-md">
                Get Started
              </button>
            </>
          )}
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

        {/* Search bar */}
        <div className="max-w-md mx-auto mt-10">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-blue-500" size={20} />
            <input
              type="text"
              placeholder="Search books by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-md border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-200 placeholder-gray-400 text-gray-800"
            />
          </div>
        </div>
              
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedCategories.includes(category)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

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
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-black text-white"}`}>
              Previous
            </button>
            <div className="font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-black text-white"}`}>
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
