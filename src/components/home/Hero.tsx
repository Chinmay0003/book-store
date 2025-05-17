import Image from "next/image";
import { User } from "@/types/user";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import userImg from "../../../public/bookImg.jpg";
import { useCartStore } from "@/lib/books/bookStore";
import logoImage from "@/assets/logo.jpg";
import { motion } from "framer-motion";
import Navbar from "@/components/home/Navbar";

export default function Hero() {

  return (
    <section className="w-full bg-white pb-4 px-0">
      {/* Navigation Bar */}
      <Navbar/>
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
