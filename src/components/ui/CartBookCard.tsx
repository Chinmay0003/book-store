// components/CartBookCard.tsx
"use client";

import { IBookData } from "@/lib/books/types";
import Image from "next/image";
import { useState, useRef } from "react";
import BookModal from "./BookModal";

interface CartBookCardProps {
  book: IBookData;
  onRemove: (id: number) => void;
}

export default function CartBookCard({ book, onRemove }: CartBookCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstMedia = book.bookMedia[0];

  const handleCardClick = () => setIsModalOpen(true);

  return (
    <>
      <div
        onClick={handleCardClick}
        className="w-full max-w-xs bg-gradient-to-br from-pink-100 to-blue-100 shadow-md rounded-2xl p-4 cursor-pointer relative hover:shadow-lg transition"
      >
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-black">
          {firstMedia?.metadata.mime_type.startsWith("video") ? (
            <video
              ref={videoRef}
              src={firstMedia.metadata.s3_url}
              muted
              className="w-full h-full object-contain"
              playsInline
              loop
              autoPlay
            />
          ) : (
            <Image
              src={firstMedia.metadata.s3_url}
              alt={book.name}
              layout="fill"
              className="object-contain"
            />
          )}
        </div>

        <div className="mt-4 space-y-1 text-center">
          <h3 className="text-lg font-bold text-gray-800">{book.name}</h3>
          <p className="text-sm text-gray-600">{book.category}</p>
          <p className="text-sm text-gray-500">
            {book.type} | {book.quality}
          </p>
          <p className="text-xl font-semibold text-gray-900">
            ₹{book.price.toFixed(2)}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(book.id);
          }}
          className="mt-3 block mx-auto bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Remove from Cart
        </button>
      </div>

      {isModalOpen && (
        <BookModal book={book} onClose={() => setIsModalOpen(false)} hideBuyNow />
      )}
    </>
  );
}
