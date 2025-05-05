"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react"; // for search icon
import Image from "next/image";
import { fetchBooks } from "@/lib/books/api"; // adjust path if needed
import { IGetAllBooksResponse } from "@/lib/books/types"; // adjust if needed
import BookCard from "@/components/ui/BookCard";
import { authUser, redirectToSignin } from "@/lib/auth/api";
import Link from "next/link";
import { addBookToCart, fetchActiveCart, updateCartWithBooks } from "@/lib/cart/api";

export default function Home() {
  const [books, setBooks] = useState<IGetAllBooksResponse["bookData"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [user, setUser] = useState<null | { name: string; email: string; photoUrl?: string }>(null);
  const [cart, setCart] = useState<number[]>([]); // Store cart items (book IDs)

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

  useEffect(() => {
    const fetchUserAndCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const userData = await authUser(token);
        setUser(userData);
  
        // 👇 Fetch cart AFTER setting user
        const cartBooks = await fetchActiveCart(token);
        if (cartBooks) {
          setCart(cartBooks.map(e => e.id));
        }
      } catch (err) {
        console.error("Error fetching user or cart", err);
      }
    };
  
    fetchUserAndCart();
  }, []);

  // ✅ Initiate Google sign-in
  const handleSignIn = () => {
    window.location.href = redirectToSignin();
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Handle adding book to cart
  const handleAddToCart = async (bookId: number) => {
    setCart((prevCart) => [...prevCart, bookId]); // Add book ID to cart
    // Now call the API to add the book to the cart in the database
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return; // Handle unauthenticated users if needed
    }

    try {
      const response = await addBookToCart(bookId, token);
      if (response) {
        console.log("Book added to cart successfully");
      } else {
        console.error("Failed to add book to cart");
        // Optionally, remove from cart if the API call fails (to keep UI in sync)
        setCart((prevCart) => prevCart.filter((id) => id !== bookId));
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      // Optionally, handle any error (e.g., show a toast notification)
    }
  };

  const handleRemoveFromCart = async (bookId: number) => {
    // Remove the book ID from the local cart state
    setCart((prevCart) => prevCart.filter((id) => id !== bookId));
  
    // Call your API to update the cart in the database
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return; // Handle unauthenticated users if needed
    }
    try {
      const response = await updateCartWithBooks(cart, token);
      if (response) {
        console.log("Book removed from cart successfully");
      } else {
        console.error("Failed to remove book from cart");
      } 
    } catch (error) {
      console.error('Error removing book from cart:', error);
      // Optionally: Show an error message to the user
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(books.length / booksPerPage);
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
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium px-4 py-2 rounded-lg transition shadow-sm"
        >
          🛒 <span>Cart ({cart.length})</span>
        </Link>


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
            <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} cart={cart} handleRemoveFromCart={handleRemoveFromCart}/>
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
};
