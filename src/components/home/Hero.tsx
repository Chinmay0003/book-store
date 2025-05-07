import { User } from "@/types/user";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import userImg from "../../../public/bookImg.jpg";
import { useCartStore } from "@/lib/books/bookStore";

export default function Hero({
  userInfo,
  handleSign,
  handleSignOut,
}: {
  userInfo: User | null;
  handleSign: () => void;
  handleSignOut: () => void;
}) {
  const user = userInfo;
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);

  return (
    <section className="w-full bg-white pb-16 px-4">
      {/* Navigation Bar */}
      <nav className="max-w-8xl mx-auto flex items-center justify-between py-8 px-5 relative text-black">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="inline-block bg-[#23395d] rounded-md p-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white">
              <rect
                x="8"
                y="8"
                width="14"
                height="32"
                rx="2"
                fill="#23395d"
                stroke="#fff"
              />
              <rect
                x="26"
                y="8"
                width="14"
                height="32"
                rx="2"
                fill="#FFD93D"
                stroke="#fff"
              />
              <path d="M22 12H26" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 36H26" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 16h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 32h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M29 16h4"
                stroke="#23395d"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M29 32h4"
                stroke="#23395d"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-3xl font-bold text-[#23395d]">Mybestkid</span>
        </div>
        {/* Hamburger Icon for mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none text-black"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen((v) => !v)}>
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Desktop Nav */}
        <div className="hidden md:flex text-black">
          {/* Navigation: Only show sign out and user image if user exists */}
          {user ? (
            <div className="flex gap-6 text-[#23395d] font-medium text-lg">
              <button
                className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-6 w-6 text-[#22223b]" />

                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart?.length || 0}
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                {/* Sign out Icon */}
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                Sign out
              </button>
              {/* User Image */}
              <div className="w-12 h-12 rounded-full overflow-hidden border border-black transition-transform duration-300 hover:scale-105">
                <img
                  src={user.photoUrl || userImg.src}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-6 text-[#23395d] font-medium text-lg">
              <a
                href="#"
                className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                {/* Home Icon */}
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0h4"
                  />
                </svg>
                HOME
              </a>
              <a
                onClick={handleSign}
                className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                {/* Sign in Icon */}
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Sign in
              </a>
            </div>
          )}
        </div>
        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div className="absolute top-full left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 flex flex-col p-4 md:hidden text-black">
            {user ? (
              <>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-black mx-auto">
                  <img
                    src={user.photoUrl || userImg.src}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="flex items-center gap-2 mb-4 mt-4 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => {
                    setMobileNavOpen(false);
                    router.push("/cart");
                  }}>
                  <ShoppingCart className="h-5 w-5 text-[#22223b]" />
                  Cart ({cart?.length || 0})
                </button>
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2 mb-4 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                  {/* Sign out Icon */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <a
                  href="#"
                  className="flex items-center gap-2 mb-4 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => setMobileNavOpen(false)}>
                  {/* Home Icon */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0h4"
                    />
                  </svg>
                  HOME
                </a>
                <a
                  onClick={() => {
                    setMobileNavOpen(false);
                    handleSign();
                  }}
                  className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                  {/* Sign in Icon */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Sign in
                </a>
              </>
            )}
          </div>
        )}
      </nav>
      {/* Hero Main Content */}
      <div className="max-w-6xl mt-10 py-5 mx-auto flex flex-col md:flex-row items-center justify-between gap-10 ">
        {/* Left: Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#22223b] mb-4">
            StoryTime Adventures
          </h1>
          <h2 className="text-2xl text-[#4a4e69] mb-4 font-medium">
            Discover the Magic of Reading
          </h2>
          <p className="text-base md:text-lg text-[#22223b] mb-8 max-w-xl">
            Mybestkid makes reading fun and safe for every child. Discover, enjoy, and
            share the best books—curated for curious young minds and caring families.
          </p>
          <button
            className="bg-[#23395d] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#1a253a] transition"
            onClick={() => {
              const section = document.getElementById("book-collection");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}>
            Buy now
          </button>
        </div>
        {/* Right: SVG Illustration */}
        <div className="flex-1 flex justify-center md:justify-end">
          {/* Random SVG illustration */}
          <svg
            width="320"
            height="260"
            viewBox="0 0 320 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="40" width="200" height="160" rx="24" fill="#f3f4f6" />
            <rect x="90" y="70" width="140" height="20" rx="6" fill="#c7d2fe" />
            <rect x="90" y="100" width="100" height="16" rx="5" fill="#a5b4fc" />
            <rect x="90" y="130" width="120" height="16" rx="5" fill="#a5b4fc" />
            <rect x="90" y="160" width="80" height="16" rx="5" fill="#a5b4fc" />
            <ellipse cx="250" cy="210" rx="30" ry="8" fill="#e0e7ef" />
            <ellipse cx="110" cy="210" rx="30" ry="8" fill="#e0e7ef" />
            <circle cx="220" cy="120" r="18" fill="#fbbf24" />
            <rect x="200" y="150" width="40" height="12" rx="4" fill="#f87171" />
            <rect x="120" y="180" width="80" height="8" rx="3" fill="#c7d2fe" />
          </svg>
        </div>
      </div>
    </section>
  );
}
