"use client";

import { useEffect, useState } from "react";
import { fetchActiveCart, updateCartWithBooks } from "@/lib/cart/api";
import { IBookData } from "@/lib/books/types";
import Image from "next/image";
import { authUser, redirectToSignin } from "@/lib/auth/api";
import CartBookCard from "@/components/ui/CartBookCard";

export default function CartPage() {
  const [cartBooks, setCartBooks] = useState<IBookData[]>([]);
  const [user, setUser] = useState<null | { name: string; email: string; photoUrl?: string }>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);

      authUser(storedToken).then((userData) => {
        if (userData) setUser(userData);
      });

      fetchActiveCart(storedToken).then((data) => {
        setCartBooks(data || []);
      });
    }
  }, []);

  const handleRemove = async (bookId: number) => {
    const updatedBooks = cartBooks.filter((b) => b.id !== bookId);
    setCartBooks(updatedBooks);
    if (token) {
      await updateCartWithBooks(updatedBooks.map((b) => b.id), token);
    }
  };

  const handleSignIn = () => {
    window.location.href = redirectToSignin();
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const totalCost = cartBooks.reduce((sum, book) => sum + (book.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      {/* Header */}
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

      {/* Cart Content */}
      <main className="px-6 py-10">
        <h1 className="text-4xl font-extrabold mb-6 text-purple-700">🛍️ Your Magical Cart</h1>

        {cartBooks.length === 0 ? (
          <p className="text-lg text-gray-600">Your cart is empty. Let’s go book hunting!</p>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-8 bg-white shadow-md rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xl font-semibold text-purple-700">
                Total cost: <span className="text-2xl text-green-600">₹{totalCost}</span>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-md transition">
                Proceed to Checkout
              </button>
            </div>

            {/* Cart Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {cartBooks.map((book) => (
                <CartBookCard key={book.id} book={book} onRemove={handleRemove} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
