"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface PaymentSuccessModalProps {
  onFinish: () => void;
}

export default function PaymentSuccessModal({ onFinish }: PaymentSuccessModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // 2.5 seconds delay before navigating

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: 0.2,
          }}
          className="text-green-500 mb-4">
          <CheckCircle2 size={72} strokeWidth={1.5} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-semibold text-gray-800">
          Payment Successful!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 mt-2">
          Redirecting to homepage...
        </motion.p>
      </motion.div>
    </div>
  );
}
