"use client";

import { useEffect, useState, useRef } from "react"; // ✨ Added useRef
import Image from "next/image";
import { IBookData } from "@/lib/books/types";

interface BookModalProps {
  book: IBookData;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null); // ✨ Added ref

  useEffect(() => {
    document.body.style.overflow = "hidden"; // prevent background scroll
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2; // ✨ Set video speed to 2X whenever media changes
    }
  }, [currentMediaIndex]);

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % book.bookMedia.length);
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + book.bookMedia.length) % book.bookMedia.length);
  };

  const currentMedia = book.bookMedia[currentMediaIndex];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // Close modal if background is clicked
      }}
    >
      <div className="bg-white w-full md:w-[70%] lg:w-[50%] xl:w-[40%] max-h-[90%] overflow-y-auto rounded-xl p-6 relative transition-transform transform duration-300 ease-in-out">
        
        {/* Media Section */}
        <div className="relative w-full bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: 3 / 4, maxHeight: "600px" }}>
          {currentMedia.metadata.mime_type.startsWith("video") ? (
            <video
              ref={videoRef}
              src={currentMedia.metadata.s3_url}
              controls
              muted
              className="object-contain w-full h-full"
              autoPlay
            />
          ) : (
            <Image
              src={currentMedia.metadata.s3_url}
              alt={book.name}
              layout="fill"
              objectFit="contain"
              className="object-contain"
            />
          )}

          {/* Left & Right Arrows (moved inside media container) */}
          {book.bookMedia.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-2 text-white shadow-md hover:bg-gray-700 transition"
                aria-label="Previous Media"
              >
                <span className="text-xl">◀</span>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-2 text-white shadow-md hover:bg-gray-700 transition"
                aria-label="Next Media"
              >
                <span className="text-xl">▶</span>
              </button>
            </>
          )}
        </div>


        {/* Media Index Bubbles */}
        {book.bookMedia.length > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-6">
            {book.bookMedia.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentMediaIndex ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        )}

        {/* Book Details */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">{book.name}</h2>
          <p className="text-blue-600 font-semibold">{book.category}</p>
          <p className="text-gray-700">
            {book.type} book | {book.quality} quality
          </p>
          <p className="text-3xl font-semibold text-gray-900">₹{book.price.toFixed(2)}</p>
        </div>

        {/* Buy Now Button */}
        <button
          className="w-full bg-black text-white py-3 rounded-lg text-lg mt-6 hover:bg-gray-800 transition-all duration-300 ease-in-out"
          onClick={() => alert("Redirecting to buy page...")}
        >
          Buy Now
        </button>

      </div>
    </div>
  );
}
