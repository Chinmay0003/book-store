"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Video,
  ShoppingCart,
  Zap,
  BookOpen,
  Truck,
  Info,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useBookStore, useCartStore } from "@/lib/books/bookStore";
import { IBookData } from "@/lib/books/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { addBookToCart, fetchActiveCart, updateCartWithBooks } from "@/lib/cart/api";
import { redirectToSignin } from "@/lib/auth/api";

const ProductPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { selectedBook } = useBookStore();
  const [book, setBook] = useState<IBookData | null>(selectedBook);
  const { cart, setCart } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);
  const router = useRouter();
  if (!book) {
    router.replace("/");
    return null;
  }
  const handleAddToCart = async (bookId: number) => {
    setIsAddingToCart(true);
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = redirectToSignin();
      console.error("User not authenticated");
      setIsAddingToCart(false);
      return;
    }
    try {
      await addBookToCart(bookId, token);
      // Always fetch the latest cart from backend after add
      const latestCart = await fetchActiveCart(token);
      const updatedCart = (latestCart ?? [])
        .filter((book) => book.isSold === false)
        .map((book) => book.id);
      setCart(updatedCart);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % book.bookMedia.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + book.bookMedia.length) % book.bookMedia.length,
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply top-20 left-20 animate-float" />
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-50 animate-float" />
        <div className="floating-shape absolute w-64 h-64 bg-purple-100 rounded-full opacity-40 mix-blend-multiply top-40 right-32 animate-float delay-500" />
        <div className="floating-shape absolute w-32 h-32 bg-blue-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-1/3 animate-float delay-1000" />
      </div>

      {/* Cart Icon */}
      <div className="fixed top-10 right-6 z-50 flex items-center justify-center">
        <Link
          href="/cart"
          prefetch
          className="relative flex items-center justify-center p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          aria-label="Go to cart">
          <ShoppingCart className="h-6 w-6 text-[#22223b]" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart?.length || 0}
          </span>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Product Images */}
          <div className="relative">
            <div className="sticky top-8 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-xl">
                {book.bookMedia[currentImageIndex]?.metadata?.mime_type.startsWith(
                  "video/",
                ) ? (
                  <video
                    src={book.bookMedia[currentImageIndex]?.metadata?.s3_url || ""}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={book.bookMedia[currentImageIndex]?.metadata?.s3_url || ""}
                    alt={book.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                )}
                {/* Navigation arrows */}
                <button
                  onClick={() => prevImage()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                  aria-label="Previous image">
                  <ChevronLeft className="h-6 w-6 text-black" />
                </button>
                <button
                  onClick={() => nextImage()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                  aria-label="Next image">
                  <ChevronRight className="h-6 w-6 text-black" />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {book.bookMedia.map((img, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-[#22223b] shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}>
                    {img.metadata?.mime_type.startsWith("video/") ? (
                      <video
                        src={img.metadata?.s3_url || ""}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={img.metadata?.s3_url || ""}
                        alt={`Thumbnail ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="flex flex-col mt-10 py-10 px-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            {/* Rating */}
            <div className="flex items-center mb-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500" />
                5.0
              </span>
            </div>

            <h1 className="text-4xl text-[#22223b] mb-2 mt-4 font-bold">{book.name}</h1>

            <div className="text-3xl text-[#22223b] mb-2 mt-8 font-semibold">
              Rs. {book.price}
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Pay in 4 interest-free installments for orders over Rs.50 with{" "}
              <span className="font-semibold">BookStore</span>.{" "}
              <span className="underline hover:text-[#22223b] cursor-pointer">
                Learn more
              </span>
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-6">
              {cart.includes(book.id) ? (
                <>
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        window.location.href = redirectToSignin();
                        return;
                      }
                      setIsRemovingFromCart(true);
                      try {
                        const updatedCart = cart.filter((id) => id !== book.id);
                        await updateCartWithBooks(updatedCart, token);
                        const latestCart = await fetchActiveCart(token);
                        setCart(latestCart ? latestCart.map((b) => b.id) : []);
                      } catch (err) {
                        console.error("Error removing from cart:", err);
                      } finally {
                        setIsRemovingFromCart(false);
                      }
                    }}
                    className="py-3 px-4 border border-red-400 text-red-600 rounded-md hover:bg-red-50 transition-all flex items-center justify-center gap-2 hover:shadow-md"
                    disabled={isRemovingFromCart}>
                    <Minus className="h-5 w-5" />
                    {isRemovingFromCart ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 mr-1 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Removing...
                      </span>
                    ) : (
                      "Remove from cart"
                    )}
                  </button>
                  <Link
                    href="/cart"
                    prefetch
                    className="py-3 px-4 bg-[#22223b] text-white rounded-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 hover:shadow-md">
                    <ShoppingCart className="h-5 w-5" />
                    Go to cart
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAddToCart(book.id)}
                    className="py-3 px-4 border border-gray-300 rounded-md text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2 hover:shadow-md"
                    disabled={isAddingToCart}>
                    <ShoppingCart className="h-5 w-5" />
                    {isAddingToCart ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 mr-1 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleAddToCart(book.id).then(() => router.push("/cart"))
                    }
                    className="py-3 px-4 bg-[#22223b] text-white rounded-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 hover:shadow-md">
                    <Zap className="h-5 w-5" />
                    Buy it now
                  </button>
                </>
              )}
            </div>

            <p className="text-md text-[#22223b] mb-6 leading-relaxed">
              "Explore this captivating book with rich content and engaging
              storytelling. Perfect for readers of all ages looking for an immersive
              experience."
            </p>

            {/* Accordions */}
            <div className="border-t border-gray-200 text-[#22223b] mt-4 pt-4">
              <Accordion type="single" collapsible className="w-full">

                <AccordionItem value="shipping">
                  <AccordionTrigger className="py-4 flex items-center gap-3 hover:text-[#22223b] transition-colors">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <span className="text-lg">Shipping & Returns</span>
                    <ChevronDown className="h-5 w-5 ml-auto transition-transform" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-gray-600 space-y-2 text-sm pl-8 pr-4 pb-4">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        Enjoy free standard shipping on all orders over ₹599.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        Orders are shipped within 7 days of purchase.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        A flat delivery fee of ₹100 applies to all orders below ₹599, across all regions.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        We offer a 7-day return policy for your convenience.
                      </li>
                    </ul>
                  </AccordionContent>

                </AccordionItem>

              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;
