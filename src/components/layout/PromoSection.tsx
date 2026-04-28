import Link from 'next/link'
import { Banknote, MessageCircle, Truck, ShieldCheck } from 'lucide-react'

export function PromoSection() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'

  return (
    <section className="py-10 bg-[#f5f5f7] border-b border-[#e8e8ed]">
      <div className="container-store">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Dark card */}
          <div
            className="rounded-2xl p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1c1c1e, #2c2c2e)' }}
          >
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#a1a1a6] mb-3">
                📦 Envío en el día
              </p>
              <h3 className="text-[28px] font-bold text-white leading-tight tracking-tight mb-2">
                SAME DAY<br />Delivery en AMBA
              </h3>
              <p className="text-[13px] text-[#a1a1a6]">
                Pedís antes de las 14hs, lo recibís hoy.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1d1d1f] rounded-full text-[13px] font-medium hover:bg-[#f5f5f7] transition-all hover:scale-[1.02]"
              >
                Saber más →
              </Link>
            </div>
          </div>

          {/* Light card */}
          <div
            className="rounded-2xl p-8 flex flex-col justify-between min-h-[220px]"
            style={{ background: 'linear-gradient(135deg, #e8f4fd, #d0e8f8)' }}
          >
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0071e3] mb-3">
                💳 Sin interés
              </p>
              <h3 className="text-[28px] font-bold text-[#1d1d1f] leading-tight tracking-tight mb-2">
                Pagá en cuotas<br />por transferencia
              </h3>
              <p className="text-[13px] text-[#6e6e73]">
                Acordá hasta 12 cuotas directo con nosotros.
              </p>
            </div>
            <div className="mt-6">
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('¡Hola! Quiero saber sobre el pago en cuotas.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0071e3] text-white rounded-full text-[13px] font-medium hover:bg-[#0077ed] transition-all hover:scale-[1.02]"
              >
                <MessageCircle size={14} />
                Consultar →
              </a>
            </div>
          </div>
        </div>

        {/* Benefits row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { icon: ShieldCheck, title: 'Garantía 3 meses', sub: 'En todos los equipos' },
            { icon: Truck,       title: 'Envío a todo el país', sub: 'Con seguimiento' },
            { icon: Banknote,    title: 'Cuotas sin interés', sub: 'Por transferencia' },
            { icon: MessageCircle, title: 'Soporte WhatsApp', sub: 'Respuesta inmediata' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="bg-white border border-[#e8e8ed] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#e8f4fd] rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-[#0071e3]" />
              </div>
              <div>
                <p className="text-[12.5px] font-semibold text-[#1d1d1f]">{title}</p>
                <p className="text-[10.5px] text-[#6e6e73]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
