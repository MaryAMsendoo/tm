"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { generalWhatsappUrl } from "../../lib/whatsapp";

export function WhatsAppFab() {
  return (
    <motion.a
      href={generalWhatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
    >
      <FaWhatsapp size={28} />
    </motion.a>
  );
}