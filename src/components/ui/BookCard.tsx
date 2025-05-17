"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IBookData } from "@/lib/books/types";
import { Eye, ShoppingCart, XCircle, BookOpen, IndianRupee } from "lucide-react";
import { useBookStore } from "@/lib/books/bookStore";

interface BookCardProps {
  book: IBookData;
  cart: number[];
  onAddToCart?: (bookId: number) => void;
  handleRemoveFromCart?: (bookId: number) => void;
}

export default function BookCard({ book, cart }: BookCardProps) {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const router = useRouter();

  return (
    <>
      <div className="bg-white border border-blue-100 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 flex flex-col items-center p-0 mx-auto min-h-[370px] max-w-xs hover:scale-105 overflow-hidden">
        {/* Clickable Preview */}
        <div
          className="relative w-full h-60 group cursor-pointer"
          onMouseEnter={() => {
            const video = videoRefs.current[book.id];
            if (video) {
              video.muted = true;
              video.playbackRate = 2;
              video.play().catch(() => {});
            }
          }}
          onMouseLeave={() => {
            const video = videoRefs.current[book.id];
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          }}>
          {book.bookMedia.some(
            (media) => media?.metadata?.mime_type === "video/mp4",
          ) ? (
            <>
              <video
                ref={(el) => {
                  videoRefs.current[book.id] = el;
                }}
                src={
                  book.bookMedia.find(
                    (media) => media?.metadata?.mime_type === "video/mp4",
                  )?.metadata?.s3_url || ""
                }
                muted
                loop
                playsInline
                className="absolute w-full h-full object-cover rounded-t-xl"
              />
              <Image
                src={book.bookMedia.filter(e=>e.type==="image")[0]?.metadata?.s3_url || ""}
                alt={book.name}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-0 rounded-t-xl"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </>
          ) : (
            <Image
              src={book.bookMedia.filter(e=>e.type==="image")[0]?.metadata?.s3_url || ""}
              alt={book.name}
              fill
              className="object-cover rounded-t-xl"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          )}
        </div>

        {/* Book Info */}
        <div className="flex flex-col items-center gap-3 w-full mb-4 px-4 mt-4">
          <div className="flex items-center gap-2 w-full">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg text-[#22223b] truncate">{book.name}</h2>
          </div>

          <div className="flex items-center gap-2 w-full">
            <IndianRupee className="w-5 h-5 text-green-600" />
            <p className="text-xl font-bold text-[#22223b]">{book.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
