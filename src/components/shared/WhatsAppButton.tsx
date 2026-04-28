'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'
  const href = `https://wa.me/${phone}?text=${encodeURIComponent('¡Hola! Quiero más información sobre sus iPhones.')}`
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full shadow-lg"
      style={{ width: 54, height: 54, background: '#25d366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={26} className="text-white" fill="white" />
      <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-25" />
    </motion.a>
  )
}
