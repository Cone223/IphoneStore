'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react'

export function NosotrosTeaser() {
  return (
    <section className="py-14 bg-white border-b border-[#e8e8ed]">
      <div className="container-store">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0071e3] mb-4">
              Por qué elegirnos
            </p>
            <h2 className="text-[34px] font-bold text-[#1d1d1f] leading-tight tracking-tight mb-5">
              Tu tienda Apple<br />
              de <span className="text-[#0071e3]">confianza</span><br />
              en Argentina.
            </h2>
            <p className="text-[14px] text-[#6e6e73] leading-relaxed mb-7 max-w-sm">
              Somos especialistas en iPhones nuevos y usados certificados. Cada equipo pasa por más de 50 puntos de control técnico antes de publicarse.
            </p>
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 text-[13px] text-[#0071e3] border border-[#0071e3]/30 px-5 py-2.5 rounded-full hover:bg-[#e8f4fd] transition-all"
            >
              Conocernos mejor <ArrowRight size={13} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            {[
              { icon: ShieldCheck, title: 'Garantía real en todos los equipos', sub: '3 meses de cobertura técnica incluida' },
              { icon: Award,       title: 'Certificación técnica propia',        sub: 'Más de 50 puntos de revisión por equipo' },
              { icon: Zap,         title: 'SAME DAY en AMBA',                    sub: 'Pedís antes de las 14hs, recibís hoy' },
            ].map(({ icon: Icon, title, sub }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-4 bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl p-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e8f4fd] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#0071e3]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1d1d1f]">{title}</p>
                  <p className="text-[11px] text-[#6e6e73] mt-0.5">{sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
