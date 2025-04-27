"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import BookModal from "@/components/ui/BookModal";
import { IBookData } from "@/lib/books/types";

interface BookCardProps {
  book: IBookData;
}

export default function BookCard({ book }: BookCardProps) {
  const [showModal, setShowModal] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  return (
    <>
      <div className="bg-white p-6 rounded-lg w-72 shadow hover:scale-105 transition-transform duration-200">
        {/* Book Name & Category */}
        <h2 className="text-lg font-bold">{book.name}</h2>
        <p className="text-blue-600 font-medium capitalize">{book.category}</p>

        {/* Book Media Preview */}
        {book.bookMedia.length > 0 && (
          <div className="relative w-full h-48 mt-4 rounded-md overflow-hidden group">
            {book.bookMedia.some((media) => media.metadata.mime_type === "video/mp4") ? (
              <div
                className="w-full h-full relative"
                onMouseEnter={() => {
                  const video = videoRefs.current[book.id];
                  if (video) {
                    video.muted = true;
                    video.playbackRate = 2;
                    video.play().catch((err) => console.log("Play error", err));
                  }
                }}
                onMouseLeave={() => {
                  const video = videoRefs.current[book.id];
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <video
                  ref={(el) => {(videoRefs.current[book.id] = el)}}
                  src={
                    book.bookMedia.find(
                      (media) => media.metadata.mime_type === "video/mp4"
                    )?.metadata.s3_url || ""
                  }
                  muted
                  loop
                  playsInline
                  className="object-cover w-full h-full rounded-md absolute top-0 left-0"
                />
                <Image
                  src={book.bookMedia[0].metadata.s3_url}
                  alt={book.name}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={true}
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={book.bookMedia[0].metadata.s3_url}
                  alt={book.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Book Details */}
        <p className="text-sm text-gray-700 mt-2">
          {book.type} - {book.quality} quality
        </p>
        <p className="text-sm text-gray-700 mt-1">₹{book.price.toFixed(2)}</p>

        {/* View Book Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          View Book
        </button>
      </div>

      {/* Book Modal */}
      {showModal && (
        <BookModal book={book} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
