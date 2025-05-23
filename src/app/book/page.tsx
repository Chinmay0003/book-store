"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coins,
  Layers,
  Minus,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";

import { getBookById } from "@/lib/books/api";
import { redirectToSignin } from "@/lib/auth/api";
import { IBookData } from "@/lib/books/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import Navbar from "@/components/home/Navbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useCartStore } from "@/lib/books/bookStore";

const BookDetailsPage = () => {
  const [book, setBook] = useState<IBookData | null>(null);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, initializeCart } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = parseInt(searchParams.get("id") ?? "0");

  useEffect(() => {
    if (!bookId) {
      router.replace("/");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getBookById(bookId);
        if (!data) {
          router.replace("/");
          return;
        }
        setBook(data);

        // Ensure cart is loaded from server if not already
        const token = localStorage.getItem("token");
        if (token && cart.length === 0) {
          await initializeCart();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    console.log(cart);
  }, [bookId, router, cart.length, initializeCart]);

  const handleAddToCart = async (bookId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = redirectToSignin();
      return;
    }

    setIsAddingToCart(true);
    try {
      addToCart(bookId);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async (bookId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = redirectToSignin();
      return;
    }

    setIsRemovingFromCart(true);
    try {
      removeFromCart(bookId);
    } catch (err) {
      console.error("Error removing from cart:", err);
    } finally {
      setIsRemovingFromCart(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white overflow-hidden relative">
        {/* Floating Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply top-20 left-20 animate-float" />
          <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-50 animate-float" />
          <div className="floating-shape absolute w-64 h-64 bg-purple-100 rounded-full opacity-40 mix-blend-multiply top-40 right-32 animate-float delay-500" />
          <div className="floating-shape absolute w-32 h-32 bg-blue-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-1/3 animate-float delay-1000" />
        </div>
        <Navbar />
        <LoadingSpinner />
      </div>
    );

  if (!book) return null;

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % book.bookMedia.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + book.bookMedia.length) % book.bookMedia.length,
    );

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      <Navbar />
      {/* Floating Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply top-20 left-20 animate-float" />
        <div className="floating-shape absolute w-48 h-48 bg-pink-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-50 animate-float" />
        <div className="floating-shape absolute w-64 h-64 bg-purple-100 rounded-full opacity-40 mix-blend-multiply top-40 right-32 animate-float delay-500" />
        <div className="floating-shape absolute w-32 h-32 bg-blue-100 rounded-full opacity-60 mix-blend-multiply bottom-20 left-1/3 animate-float delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Media Section */}
          <div className="relative">
            <div className="sticky top-10 space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-xl">
                {book.bookMedia[currentImageIndex]?.metadata.mime_type.startsWith(
                  "video/",
                ) ? (
                  <video
                    src={book.bookMedia[currentImageIndex].metadata.s3_url}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    ref={(video) => {
                      if (video) {
                        video.playbackRate = 2.0;
                      }
                    }}
                  />
                ) : (
                  <Image
                    src={book.bookMedia[currentImageIndex].metadata.s3_url}
                    alt={book.name}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                )}
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                  <ChevronLeft className="h-6 w-6 text-black" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                  <ChevronRight className="h-6 w-6 text-black" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {book.bookMedia.map((media, index) => (
                  <button
                    key={media.id}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-[#22223b] shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}>
                    {media.metadata.mime_type.startsWith("video/") ? (
                      <video
                        src={media.metadata.s3_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <Image
                        src={media.metadata.s3_url}
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

          {/* Info Section */}
          <div className="flex flex-col mt-6 py-10 px-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="flex items-center mb-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500" />
                5.0
              </span>
            </div>
            <h1 className="text-4xl text-[#22223b] mb-2 mt-4 font-bold">{book.name}</h1>

            <div className="mt-8 space-y-6 text-[#22223b]">
              {/* Price */}
              <div className="flex items-center space-x-4">
                <Coins className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-bold">₹ {book.price.toFixed(0)}</p>
                </div>
              </div>

              {/* Book Type */}
              <div className="flex items-center space-x-4">
                <Layers className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-2xl font-semibold">{book.type}</p>
                </div>
              </div>

              {/* Book Quality */}
              <div className="flex items-center space-x-4">
                <BadgeCheck className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-500">Quality</p>
                  <p className="text-2xl font-semibold">{book.quality}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-6">
              {cart.includes(book.id) ? (
                <>
                  {/* Remove from Cart */}
                  <button
                    onClick={() => handleRemoveFromCart(book.id)}
                    className={`py-3 px-4 border rounded-md transition-all flex items-center justify-center gap-2 hover:shadow-md ${
                      isRemovingFromCart
                        ? "border-red-400 text-red-600 bg-red-50"
                        : "border-gray-300 text-black hover:bg-gray-50"
                    }`}
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

                  {/* Go to Cart */}
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
                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(book.id)}
                    className={`py-3 px-4 border rounded-md transition-all flex items-center justify-center gap-2 hover:shadow-md ${
                      isAddingToCart
                        ? "border-blue-400 text-blue-600 bg-blue-50"
                        : "border-gray-300 text-black hover:bg-gray-50"
                    }`}
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

                  {/* Buy Now */}
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
            <p className="text-md text-[#22223b] mt-6 leading-relaxed">
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
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />A flat
                        delivery fee of ₹100 applies to all orders below ₹599, across
                        all regions.
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
    </div>
  );
};

const BookDetailsPageWrapper = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BookDetailsPage />
    </Suspense>
  );
};

export default BookDetailsPageWrapper;
