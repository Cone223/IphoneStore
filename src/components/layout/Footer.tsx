import Link from 'next/link'
import { MapPin, Clock, MessageCircle, Instagram } from 'lucide-react'

export function Footer() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'

  return (
    <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7]">
      <div className="container-store py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-[20px] font-bold text-[#1d1d1f]">
                iPhone<span className="text-[#0071e3]">Store</span>
              </span>
            </Link>
            <p className="text-[12px] text-[#6e6e73] leading-relaxed mb-5 max-w-[200px]">
              Tu tienda de confianza para iPhones nuevos y usados certificados en Argentina.
            </p>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-[#d2d2d7] rounded-lg flex items-center justify-center text-[#6e6e73] hover:text-[#25d366] hover:border-[#25d366]/40 transition-all"
              >
                <MessageCircle size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-[#d2d2d7] rounded-lg flex items-center justify-center text-[#6e6e73] hover:text-[#e1306c] hover:border-[#e1306c]/40 transition-all"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73] mb-4">Tienda</h4>
            <ul className="space-y-2">
              {[
                { href: '/catalog', label: 'Ver catálogo' },
                { href: '/catalog?condition=NEW', label: 'iPhones nuevos' },
                { href: '/catalog?condition=LIKE_NEW', label: 'iPhones usados' },
                { href: '/catalog?sortBy=popular', label: 'Más vendidos' },
                { href: '/wishlist', label: 'Mis favoritos' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12.5px] text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73] mb-4">Información</h4>
            <ul className="space-y-2">
              {[
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/nosotros#garantia', label: 'Garantía' },
                { href: '/nosotros#faq', label: 'Preguntas frecuentes' },
                { href: '/profile', label: 'Mi cuenta' },
                { href: '/auth/register', label: 'Crear cuenta' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[12.5px] text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73] mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-[#0071e3] flex-shrink-0 mt-0.5" />
                <span className="text-[12.5px] text-[#1d1d1f]">Buenos Aires, Argentina</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={13} className="text-[#0071e3] flex-shrink-0 mt-0.5" />
                <span className="text-[12.5px] text-[#1d1d1f]">Lun – Sáb · 9:00 a 20:00hs</span>
              </div>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('¡Hola! Quiero hacer una consulta.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11.5px] text-[#25d366] border border-[#25d366]/30 bg-white px-3 py-1.5 rounded-full hover:bg-[#f0fdf4] transition-all"
              >
                <MessageCircle size={12} /> Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#d2d2d7] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#aeaeb2]">
            © {new Date().getFullYear()} iPhoneStore · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-3">
            {['✅ IMEI verificado', '🔒 iCloud libre', '🛡️ Garantía 3 meses'].map(b => (
              <span key={b} className="text-[10px] text-[#aeaeb2] bg-white border border-[#e8e8ed] px-3 py-1 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
