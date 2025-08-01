import Image from "next/image";
import { ShoppingCart, X, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import userIcon from "@/assets/userIcon.jpg";
import { useAuthStore, useCartStore } from "@/lib/books/bookStore";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);
  const unpaidBlockedCart = useCartStore((s) => s.unpaidBlockedCart);
  const paidBlockedCart = useCartStore((s) => s.paidBlockedCart);
  const handleSignIn = useAuthStore((s) => s.handleSignIn);
  const handleSignOut = useAuthStore((s) => s.handleSignOut);

  // Close mobile nav on route change or resize to desktop
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileNavOpen(false);
    };

    // Assuming you have access to router events, otherwise you might need to handle this differently
    // For Next.js 13+ with App Router, you might need a different approach or use useEffect on a layout file
    // For this component, we'll just close it on any interaction that causes a re-render of the router.
    handleRouteChange();

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router]);

  const mobileMenuContent = (
    <>
      {user ? (
        <>
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Image
              src={userIcon}
              alt="User Icon"
              width={40}
              height={40}
              className="rounded-full border border-gray-300"
            />
            <span className="font-medium text-lg text-[#23395d]">
              Hello, {user.name || "User"}
            </span>
          </div>
          <div className="flex flex-col p-4 space-y-2">
            <Link
              href="/contact"
              onClick={() => setMobileNavOpen(false)}
              className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 rounded-lg transition">
              Contact Us
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                setMobileNavOpen(false);
              }}
              className="text-left block w-full px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 rounded-lg transition">
              Sign out
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col p-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileNavOpen(false)}
            className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Home
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileNavOpen(false)}
            className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Contact Us
          </Link>
          <button
            onClick={() => {
              handleSignIn();
              setMobileNavOpen(false);
            }}
            className="text-left block w-full px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Sign in
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1200] bg-white/80 shadow-md backdrop-blur-md">
        <nav className="max-w-8xl mx-auto flex items-center justify-between py-3 px-4 md:px-6 text-black transition-all duration-300">
          {/* Left side: Hamburger Menu (Mobile) & Logo */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded-full focus:outline-none text-black hover:bg-gray-200"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}>
              <Menu size={28} />
            </button>
            <Link href={"/"} className="flex items-center gap-3">
              <Image src="/favicon.ico" alt="Mybestkid Logo" width={40} height={40} />
              <span className="text-2xl md:text-3xl font-bold text-[#23395d]">
                Mybestkid
              </span>
            </Link>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex gap-6 text-[#23395d] font-medium text-lg"></div>
            {user ? (
              <div className="hidden md:flex items-center gap-4 text-[#23395d] font-medium text-lg">
                <Link
                  href="/contact"
                  className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition">
                  Contact Us
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition">
                  Sign out
                </button>
                <Image
                  src={userIcon}
                  alt="User Icon"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-300"
                />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/"
                  className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition">
                  Home
                </Link>
                <Link
                  href="/contact"
                  className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition">
                  Contact Us
                </Link>
                <button
                  onClick={handleSignIn}
                  className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition">
                  Sign in
                </button>
              </div>
            )}
            {user && (
              <button
                className="relative p-2 rounded-full hover:bg-gray-200"
                onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-6 w-6 text-[#22223b]" />
                {cart.length + unpaidBlockedCart.length + paidBlockedCart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length + unpaidBlockedCart.length + paidBlockedCart.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-[1300] transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="text-2xl font-bold text-[#23395d]">Menu</span>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        {mobileMenuContent}
      </div>

      {/* Overlay for Mobile Nav */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-1200"
          onClick={() => setMobileNavOpen(false)}></div>
      )}

      {/* Spacer to prevent content from being hidden behind the fixed navbar */}
      <div className="pt-20"></div>
    </>
  );
}
