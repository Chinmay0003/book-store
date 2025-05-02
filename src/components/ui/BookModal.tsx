"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IBookData } from "@/lib/books/types";
import { initiatePayment, markPaymentAsSuccessful } from "@/lib/payments/api";
import PaymentSuccessModal from "@/components/ui/PaymentSuccessfulModal";
import { PaymentInitiationResponse, RazorpayOptions } from "@/lib/payments/types";

interface BookModalProps {
  book: IBookData;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
    }
  }, [currentMediaIndex]);

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % book.bookMedia.length);
  };

  const handlePrev = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + book.bookMedia.length) % book.bookMedia.length,
    );
  };

  const handleBuyNow = async () => {
    try {
      if (isProcessingPayment) return;
      setIsProcessingPayment(true);
      const data = await initiatePayment(book.id);
      if (!data.id) throw new Error("Order not created");

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => openRazorpay(data);
        script.onerror = () => {
          throw new Error("Razorpay SDK failed to load.");
        };
        document.body.appendChild(script);
      } else {
        openRazorpay(data);
      }
    } catch (err) {
      console.error("❌ Payment initiation error:", err);
      alert("❌ Payment failed. Try again.");
    }
  };

  const openRazorpay = (data: PaymentInitiationResponse) => {
    const options: RazorpayOptions = {
      key: data.razorpayKeyId,
      amount: data.amount_due,
      currency: data.currency,
      name: "MyBestKid",
      description: `Payment for book: ${book.name}`,
      order_id: data.id,
      handler: async function () {
        try {
          setShowSuccessModal(true); // ✅ Trigger success modal
          await markPaymentAsSuccessful(book.id); // ✅ Mark book as sold
        } catch (err) {
          console.error("Post-payment processing failed:", err);
          alert("Something went wrong after payment.");
        }
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          alert("❌ Payment popup closed.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const currentMedia = book.bookMedia[currentMediaIndex];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className="bg-white w-full md:w-[70%] lg:w-[50%] xl:w-[40%] max-h-[90%] overflow-y-auto rounded-xl p-6 relative transition-transform transform duration-300 ease-in-out">
        {/* Media Section */}
        <div
          className="relative w-full bg-black rounded-lg overflow-hidden mb-4"
          style={{ aspectRatio: 3 / 4, maxHeight: "600px" }}>
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

          {/* Arrows */}
          {book.bookMedia.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 p-2 text-white rounded-full shadow-md hover:bg-gray-700">
                ◀
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 p-2 text-white rounded-full shadow-md hover:bg-gray-700">
                ▶
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {book.bookMedia.length > 1 && (
          <div className="flex justify-center space-x-2 mb-6">
            {book.bookMedia.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${i === currentMediaIndex ? "bg-blue-600" : "bg-gray-300"}`}
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
          <p className="text-3xl font-semibold text-gray-900">
            ₹{book.price.toFixed(2)}
          </p>
        </div>

        {/* Buy Button */}
        <button
          className={`w-full py-3 rounded-lg text-lg mt-6 transition ${
            isProcessingPayment
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white"
          }`}
          onClick={handleBuyNow}
          disabled={isProcessingPayment}>
          {isProcessingPayment ? "Processing..." : "Buy Now"}
        </button>
      </div>

      {/* ✅ Payment Success Modal */}
      {showSuccessModal && (
        <PaymentSuccessModal
          onFinish={() => {
            onClose();
            window.location.href = "/";
          }}
        />
      )}
    </div>
  );
}
