import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, BookHeart, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import userImg from "../../../public/bookImg.jpg";
import { useCartStore } from "@/lib/books/bookStore";
import logoImage from "@/assets/logo.jpg";
import img1 from '@/assets/celebrities/IMG_20250705_195505557.jpg';
import img2 from '@/assets/celebrities/IMG_20250705_202715477.jpg';
import img3 from '@/assets/celebrities/IMG_20250706_194053293.jpg';
import img4 from '@/assets/celebrities/IMG_20250706_210304071.jpg';
import img5 from '@/assets/celebrities/IMG_20250712_184330179.jpg';
import img6 from '@/assets/celebrities/IMG_20250712_185705838.jpg';
import Navbar from "@/components/home/Navbar";

const imagesArr1 = [img1, img2, img3];
const imagesArr2 = [img4, img5, img6];
const carouselSlides = [
  {
    id: 1,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left - Text */}
        <div className="text-center md:text-left">
          <div className="flex md:hidden items-center justify-center gap-3 mb-4"></div>
          <h2 className="text-2xl md:text-5xl font-bold text-[#23395d] mb-4 md:mb-6 leading-tight">
            Mybestkid makes reading fun and safe for every child.
          </h2>
          <p className="hidden md:block text-xl text-[#22223b] max-w-xl mx-auto md:mx-0">
            Discover, enjoy, and share the best books—curated for curious young minds and caring families.
          </p>
        </div>

        {/* Right - Image */}
        <div className="hidden md:flex justify-center md:justify-end">
          <div className="w-72 md:w-[400px]">
            <Image
              src={logoImage}
              alt="Books background"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="flex flex-col items-center text-center space-y-8 px-4 md:px-8 py-10 md:py-16 bg-gradient-to-br from-pink-50 via-white to-yellow-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 bg-clip-text text-transparent drop-shadow-sm">
          🌟 Happy Celebrities 🌟
        </h2>

        <p className="text-md md:text-xl text-[#444] max-w-3xl leading-relaxed font-medium">
          Real smiles. Real stories. <br className="hidden md:inline" />
          <span className="text-[#23395d] font-semibold">
            Kids falling in love with reading—only on Mybestkid!
          </span>
        </p>

        <div className="grid grid-cols-3 gap-6 w-full max-w-7xl">
          {imagesArr1.map((image, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-2 border-white"
            >
              <Image
                src={image}
                alt={`Happy child ${idx}`}
                width={400}
                height={300}
                className="object-cover w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="flex flex-col items-center text-center space-y-8 px-4 md:px-8 py-10 md:py-16 bg-gradient-to-br from-pink-50 via-white to-yellow-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 bg-clip-text text-transparent drop-shadow-sm">
          📚 Stories That Stick
        </h2>

        <p className="text-md md:text-xl text-[#444] max-w-3xl leading-relaxed font-medium">
          Spark imagination and lifelong learning. <br className="hidden md:inline" />
          <span className="text-[#23395d] font-semibold">
            Let books be their best friends — only at Mybestkid!
          </span>
        </p>

        <div className="grid grid-cols-3 gap-6 w-full max-w-7xl">
          {imagesArr2.map((image, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-2 border-white"
            >
              <Image
                src={image}
                alt={`Happy child ${idx}`}
                width={400}
                height={300}
                className="object-cover w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
    }, 5000); // 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-gradient-to-br from-pink-100 via-white to-red-100 md:bg-white pb-4 px-0">
      {/* Navigation Bar */}
      <Navbar />
      {/* Hero Main Content */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full py-2 pt-6">
        <div className="text-center text-3xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          #NoScreenTime
        </div>
      </motion.div>

      {/* Banner Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto mt-4 max-w-screen-md rounded-2xl bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-md px-4 py-2 md:px-6 md:py-3 text-center">
        <p className="text-[#22223b] text-base md:text-3xl font-semibold tracking-wide">
          🎉 FREE DELIVERY for Orders Above ₹599!
        </p>
      </motion.div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-20 overflow-hidden">
        <div className="min-h-[700px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselSlides[currentIndex].id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-[700px] flex items-center justify-center"
            >
              {carouselSlides[currentIndex].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-[#23395d]" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
