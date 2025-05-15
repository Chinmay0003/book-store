"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaPhone } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-[#E7F4FA] to-[#DCF2FA] min-h-screen flex items-center py-16 px-6 font-sans">
      <div className="w-full max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-[#3d405b] mb-10"
        >
          Get in Touch 📬
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          <div className="bg-[#3d405b] text-white rounded-lg p-8 shadow-lg transition-transform transform hover:scale-105">
            <FaPhone className="text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Call or WhatsApp</h2>
            <p className="text-lg font-medium">📞 9535358065</p>
          </div>

          <div className="bg-[#81b29a] text-white rounded-lg p-8 shadow-lg transition-transform transform hover:scale-105">
            <FaWhatsapp className="text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Join Our WhatsApp Community</h2>
            <Link
              href="https://chat.whatsapp.com/LqaIHLQrpedEv3zMHL1LKo"
              target="_blank"
              className="text-lg font-medium underline hover:text-yellow-300 transition-colors"
            >
              Join Now
            </Link>
          </div>

          <div className="bg-[#e07a5f] text-white rounded-lg p-8 shadow-lg transition-transform transform hover:scale-105">
            <FaInstagram className="text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Follow Us on Instagram</h2>
            <Link
              href="https://www.instagram.com/mybest.kid/"
              target="_blank"
              className="text-lg font-medium underline hover:text-pink-300 transition-colors"
            >
              @mybest.kid
            </Link>
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 text-[#3d405b] text-lg font-medium"
        >
          We’d love to hear from you! Let’s keep the magic of reading alive for every child. 📚✨
        </motion.p>
      </div>
    </div>
  );
}
