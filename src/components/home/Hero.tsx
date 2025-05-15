import Image from "next/image";
import { User } from "@/types/user";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import userImg from "../../../public/bookImg.jpg";
import { useCartStore } from "@/lib/books/bookStore";
import logoImage from "@/assets/logo.jpg";
import { motion } from "framer-motion";

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
    <section className="w-full bg-white pb-4 px-0">
      {/* Navigation Bar */}
      <nav className="max-w-8xl mx-auto flex items-center justify-between py-8 px-5 relative text-black">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/favicon.ico" alt="Mybestkid Logo" width={40} height={40} />
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
              <a href="/contact" className="border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">Contact Us</a>
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
                <a href="/contact" className="mb-4 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">Contact Us</a>
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
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full py-2"
      >
        <div className="text-center text-2xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          #NoScreenTime
        </div>
      </motion.div>


      {/* Banner Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto mt-4 max-w-screen-md rounded-2xl bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-md px-6 py-3 text-center"
      >
        <p className="text-[#22223b] text-base md:text-3xl font-semibold tracking-wide">
          🎉 FREE DELIVERY for Orders Above ₹599!
        </p>
      </motion.div>


      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left - Text */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-[#23395d] mb-6 leading-tight">
              Mybestkid makes reading fun and safe for every child.
            </h2>
            <p className="text-md md:text-lg text-[#22223b] max-w-xl mx-auto md:mx-0">
              Discover, enjoy, and share the best books—curated for curious young minds and caring families.
            </p>
          </div>

          {/* Right - Image */}
          <div className="flex justify-center md:justify-end">
            <div className="w-72 md:w-[400px]">
              <Image
                src={logoImage}
                alt="Books background"
                width={400}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>





    </section>
  );
}
