'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ShieldCheck, Truck, Award, MessageCircle,
  MapPin, Clock, Star, Users, Zap, Heart,
  ArrowRight, CheckCircle2
} from 'lucide-react'

const VALORES = [
  {
    icon: ShieldCheck,
    title: 'Honestidad total',
    desc: 'Describimos cada equipo con precisión real. Batería, estado, accesorios: todo documentado antes de que compres.',
    color: 'text-[#c9a84c]',
    bg: 'bg-[#c9a84c]/8',
    border: 'border-[#c9a84c]/15',
  },
  {
    icon: Award,
    title: 'Certificación propia',
    desc: 'Cada iPhone pasa por 50+ puntos de control técnico antes de publicarse. Si no lo aprobamos, no lo vendemos.',
    color: 'text-[#60a5fa]',
    bg: 'bg-[#60a5fa]/8',
    border: 'border-[#60a5fa]/15',
  },
  {
    icon: Zap,
    title: 'Velocidad y seriedad',
    desc: 'Respondemos en minutos, despachamos en el día. Tu tiempo vale, y lo respetamos.',
    color: 'text-[#4ade80]',
    bg: 'bg-[#4ade80]/8',
    border: 'border-[#4ade80]/15',
  },
  {
    icon: Heart,
    title: 'Relación a largo plazo',
    desc: 'No queremos una venta. Queremos que vuelvas y que nos recomiendes. Eso solo pasa si el primer paso fue perfecto.',
    color: 'text-[#f87171]',
    bg: 'bg-[#f87171]/8',
    border: 'border-[#f87171]/15',
  },
]

const STATS = [
  { val: '500+', lbl: 'Equipos vendidos', icon: Award },
  { val: '4.9', lbl: 'Reseñas promedio', icon: Star },
  { val: '48hs', lbl: 'Entrega express', icon: Truck },
  { val: '100%', lbl: 'Clientes satisfechos', icon: Users },
]

const PROCESO = [
  {
    num: '01',
    title: 'Recepción y diagnóstico',
    desc: 'Recibimos el equipo y lo sometemos a un análisis técnico completo: batería, pantalla, cámaras, altavoces, micrófono, conectividad y estado estético.',
  },
  {
    num: '02',
    title: 'Limpieza y restauración',
    desc: 'Restauramos el sistema operativo a fábrica, limpiamos el equipo y verificamos que no tenga activaciones de cuenta iCloud pendientes.',
  },
  {
    num: '03',
    title: 'Fotografía real',
    desc: 'Fotografiamos cada equipo de forma honesta. Mostramos lo que existe, sin filtros ni engaños.',
  },
  {
    num: '04',
    title: 'Publicación y venta',
    desc: 'Publicamos con toda la información: modelo exacto, almacenamiento, color, batería, estado y precio. Sin letra chica.',
  },
  {
    num: '05',
    title: 'Despacho seguro',
    desc: 'Empaquetamos con doble caja y embalaje acolchado. Seguro de envío incluido en entregas a domicilio.',
  },
]

const GARANTIA_ITEMS = [
  '3 meses de garantía técnica en todos los equipos',
  'Cambio por falla técnica dentro de los 7 días',
  'Soporte post-venta por WhatsApp',
  'Asesoramiento gratuito en la compra',
  'Verificación IMEI sin costo',
  'Equipo libre de bloqueos iCloud',
]

const PREGUNTAS = [
  {
    q: '¿Los equipos usados tienen garantía?',
    a: 'Sí, todos nuestros equipos usados tienen 3 meses de garantía técnica contra fallas de fábrica. No cubre daños físicos o por líquidos posteriores a la compra.',
  },
  {
    q: '¿Puedo ver el equipo antes de comprarlo?',
    a: 'Sí, podés coordinar un encuentro en persona en Buenos Aires para ver y probar el equipo antes de decidir. Contactanos por WhatsApp para acordar.',
  },
  {
    q: '¿Cómo sé que el equipo no está bloqueado?',
    a: 'Antes de cada venta verificamos que el equipo esté libre de iCloud, sin reportes de robo y con IMEI limpio. Podés verificarlo vos mismo con el número de IMEI que te damos.',
  },
  {
    q: '¿Puedo pagar en cuotas?',
    a: 'Trabajamos con transferencia bancaria y podemos acordar planes de pago en cuotas directamente con nosotros. Consultanos por WhatsApp.',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function NosotrosClient() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'

  return (
    <div className="min-h-screen bg-[#070707]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[#141414]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#c9a84c]/[0.04] rounded-full blur-3xl" />
        </div>
        <div className="container-store py-20 md:py-28 relative">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/8 text-[#c9a84c] text-[10px] tracking-widest uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              Quiénes somos
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Tu tienda de confianza<br />
              <em className="text-[#c9a84c] not-italic">en Apple.</em>
            </h1>
            <p className="text-[15px] text-[#666] leading-relaxed max-w-xl mx-auto mb-8">
              Somos un equipo apasionado por la tecnología Apple, con años de experiencia en la compra, revisión y venta de iPhones en Argentina. Nacimos del frustración de no encontrar un lugar serio donde comprar usados con garantía real.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-black text-[13px] font-semibold rounded-xl hover:bg-[#e0c06e] transition-all hover:scale-[1.02]"
              >
                Ver catálogo <ArrowRight size={14} />
              </Link>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('¡Hola! Me gustaría saber más sobre ustedes.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#252525] text-white text-[13px] rounded-xl hover:border-[#383838] hover:bg-white/[0.03] transition-all"
              >
                <MessageCircle size={14} className="text-[#25d366]" /> Contactar
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-[#141414] bg-[#0a0a0a]">
        <div className="container-store py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ val, lbl, icon: Icon }, i) => (
              <motion.div
                key={lbl}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center py-6"
              >
                <Icon size={20} className="text-[#c9a84c] mx-auto mb-3" />
                <p className="text-3xl font-semibold text-white mb-1">{val}</p>
                <p className="text-[11px] text-[#555] uppercase tracking-widest">{lbl}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTORIA ── */}
      <section className="border-b border-[#141414]">
        <div className="container-store py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-[10px] text-[#c9a84c] tracking-widest uppercase font-semibold mb-4 block">Nuestra historia</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-5 leading-tight">
                Nacimos de la necesidad<br />de comprar con confianza.
              </h2>
              <div className="space-y-4 text-[13px] text-[#666] leading-relaxed">
                <p>
                  Todo empezó cuando uno de nuestros fundadores quiso comprar su primer iPhone usado y no encontró ningún lugar que le transmitiera confianza. Precios sin criterio, fotos trucadas, y cero garantía real.
                </p>
                <p>
                  Así nació iPhoneStore: con la convicción de que vender tecnología tiene que basarse en la honestidad. Hoy somos el equipo de referencia en Buenos Aires para la compra y venta de iPhones con respaldo real.
                </p>
                <p>
                  Cada equipo que publicamos pasó por nuestras manos. Lo revisamos, lo probamos y lo describimos con la misma exigencia que aplicaríamos si lo compráramos nosotros mismos.
                </p>
              </div>
            </motion.div>

            {/* Visual card stack */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="relative h-[300px] md:h-[380px]">
              {[
                { top: '0%', left: '5%', rotate: '-3deg', label: 'Buenos Aires · Desde 2021', sub: '500+ clientes felices', color: '#c9a84c' },
                { top: '12%', left: '18%', rotate: '2deg', label: 'Revisión técnica propia', sub: '50+ puntos de control', color: '#60a5fa' },
                { top: '26%', left: '8%', rotate: '-1deg', label: 'Garantía real incluida', sub: '3 meses en todos los equipos', color: '#4ade80' },
              ].map((card, i) => (
                <div
                  key={i}
                  className="absolute w-64 bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 shadow-xl"
                  style={{ top: card.top, left: card.left, transform: `rotate(${card.rotate})` }}
                >
                  <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}>
                    <CheckCircle2 size={16} style={{ color: card.color }} />
                  </div>
                  <p className="text-[13px] font-medium text-white">{card.label}</p>
                  <p className="text-[11px] text-[#555] mt-0.5">{card.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className="border-b border-[#141414] bg-[#0a0a0a]">
        <div className="container-store py-16 md:py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-[10px] text-[#c9a84c] tracking-widest uppercase font-semibold mb-3 block">Nuestros valores</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">Lo que nos define</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALORES.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: i * 0.09 }}
                className={`${v.bg} border ${v.border} rounded-2xl p-6`}
              >
                <v.icon size={22} className={`${v.color} mb-4`} />
                <h3 className="text-[15px] font-medium text-white mb-2">{v.title}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section className="border-b border-[#141414]">
        <div className="container-store py-16 md:py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-[10px] text-[#c9a84c] tracking-widest uppercase font-semibold mb-3 block">Cómo trabajamos</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white">El proceso detrás de cada equipo</h2>
            <p className="text-[13px] text-[#555] mt-3 max-w-md mx-auto">
              Antes de que veas un producto en nuestra tienda, pasó por esto:
            </p>
          </motion.div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {PROCESO.map((paso, i) => (
              <motion.div
                key={paso.num}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-5 bg-[#0d0d0d] border border-[#161616] rounded-2xl p-5"
              >
                <div className="flex-shrink-0">
                  <span className="font-serif text-2xl text-[#c9a84c]/30 font-bold leading-none">{paso.num}</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-medium text-white mb-1.5">{paso.title}</h3>
                  <p className="text-[12px] text-[#555] leading-relaxed">{paso.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GARANTÍA ── */}
      <section className="border-b border-[#141414] bg-[#0a0a0a]">
        <div className="container-store py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <span className="text-[10px] text-[#c9a84c] tracking-widest uppercase font-semibold mb-4 block">Garantía y respaldo</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-5">Comprás con respaldo real</h2>
              <p className="text-[13px] text-[#555] leading-relaxed mb-8">
                No usamos la palabra "garantía" a la ligera. Cada compromiso que listamos acá lo cumplimos sin excusas.
              </p>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('¡Hola! Tengo una consulta sobre la garantía de los equipos.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25d366] text-white text-[12px] font-medium rounded-xl hover:bg-[#22c55e] transition-all"
              >
                <MessageCircle size={14} /> Consultar por WhatsApp
              </a>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
              <div className="bg-[#0d0d0d] border border-[#161616] rounded-2xl p-6 space-y-3">
                {GARANTIA_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-[#888]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b border-[#141414]">
        <div className="container-store py-16 md:py-20 max-w-2xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="text-[10px] text-[#c9a84c] tracking-widest uppercase font-semibold mb-3 block">Preguntas frecuentes</span>
            <h2 className="font-serif text-3xl text-white">Preguntas frecuentes</h2>
          </motion.div>
          <div className="space-y-3">
            {PREGUNTAS.map((faq, i) => (
              <motion.details
                key={i}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group bg-[#0d0d0d] border border-[#161616] rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-[13px] font-medium text-white hover:text-[#c9a84c] transition-colors">
                  {faq.q}
                  <span className="text-[#444] group-open:rotate-45 transition-transform duration-200 text-lg leading-none ml-3 flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-4 text-[12px] text-[#555] leading-relaxed border-t border-[#161616] pt-3">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO / CTA ── */}
      <section className="bg-[#0a0a0a]">
        <div className="container-store py-16 md:py-20">
          <motion.div {...fadeUp} className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-6">
              <MapPin size={24} className="text-[#c9a84c]" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">¿Tenés alguna duda?</h2>
            <p className="text-[13px] text-[#555] leading-relaxed mb-8">
              Estamos en Buenos Aires y respondemos por WhatsApp de lunes a sábado de 9 a 20hs.
              No hay bots, respondemos nosotros.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('¡Hola! Quiero hacer una consulta.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25d366] text-white text-[13px] font-semibold rounded-xl hover:bg-[#22c55e] transition-all hover:scale-[1.02]"
              >
                <MessageCircle size={16} /> Escribir por WhatsApp
              </a>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#c9a84c] text-black text-[13px] font-semibold rounded-xl hover:bg-[#e0c06e] transition-all"
              >
                Ver catálogo <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-[11px] text-[#3a3a3a]">
              <Clock size={11} />
              <span>Lunes a Sábado · 9:00 a 20:00hs · Buenos Aires</span>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
