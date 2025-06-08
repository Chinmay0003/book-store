import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import userImg from "../../../public/bookImg.jpg";
import userIcon from "@/assets/userIcon.jpg";
import { useAuthStore, useCartStore } from "@/lib/books/bookStore";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);
  const handleSignIn = useAuthStore((s) => s.handleSignIn);
  const handleSignOut = useAuthStore((s) => s.handleSignOut);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-1200 bg-white shadow-md max-w-8xl mx-auto flex items-center justify-between py-4 px-4 md:px-6 text-black backdrop-blur-md transition-all duration-300">
        {/* Logo */}
        <Link href={"/"}>
          <div className="flex items-center gap-3">
            <Image src="/favicon.ico" alt="Mybestkid Logo" width={40} height={40} />
            <span className="text-2xl md:text-3xl font-bold text-[#23395d]">
              Mybestkid
            </span>
          </div>
        </Link>

        {/* Hamburger Icon for Mobile */}
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
          {user ? (
            <div className="flex gap-6 text-[#23395d] font-medium text-lg">
              <button
                className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-6 w-6 text-[#22223b]" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <a
                href="/contact"
                className="border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                Contact Us
              </a>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                Sign out
              </button>
              {/* Add User Icon */}
              <Image
                src={userIcon}
                alt="User Icon"
                width={60}
                height={40}
                className="rounded-full border border-gray-300"
              />
            </div>
          ) : (
            <div className="flex gap-6 text-[#23395d] font-medium text-lg">
              <a
                href="/"
                className="border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                HOME
              </a>
              <a
                href="/contact"
                className="border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                Contact Us
              </a>
              <a
                onClick={handleSignIn}
                className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                Sign in
              </a>
            </div>
          )}
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div className="absolute top-full left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 flex flex-col p-4 md:hidden text-black text-center">
            {user ? (
              <>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="mb-4 border border-black rounded-lg px-4 py-3 text-lg hover:bg-gray-100 transition">
                  Cart ({cart.length || 0})
                </button>
                <a
                  href="/contact"
                  className="mb-4 border border-black rounded-lg px-4 py-3 text-lg hover:bg-gray-100 transition">
                  Contact Us
                </a>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center justify-center gap-2 mb-4 border border-black rounded-lg px-4 py-3 text-lg hover:bg-gray-100 transition">
                  Sign out
                </button>
                {/* Add User Icon */}
                <Image
                  src={userIcon}
                  alt="User Icon"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300 mx-auto"
                />
              </>
            ) : (
              <>
                <a
                  href="/"
                  className="mb-4 border border-black rounded-lg px-4 py-3 text-lg hover:bg-gray-100 transition"
                  onClick={() => setMobileNavOpen(false)}>
                  HOME
                </a>
                <a
                  href="/contact"
                  className="mb-4 border border-black rounded-lg px-4 py-3 text-lg hover:bg-gray-100 transition">
                  Contact Us
                </a>
                <a
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center justify-center gap-2 border border-black rounded-lg px-4 py-3 text-lg hover:bg-gray-100 transition">
                  Sign in
                </a>
              </>
            )}
          </div>
        )}
      </nav>
      <div className="pt-30"></div>
    </>
  );
}
