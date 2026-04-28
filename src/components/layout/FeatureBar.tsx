'use client'

import {
  CreditCard,
  BookOpen,
  Truck,
  Store,
  Wrench,
} from 'lucide-react'

const FEATURES = [
  {
    title: 'Comprá online',
    subtitle: 'Medios de Pago',
    icon: CreditCard,
  },
  {
    title: '+ Más',
    subtitle: 'Capacitaciones',
    icon: BookOpen,
  },
  {
    title: 'Recibílo en tu casa',
    subtitle: 'Envíos',
    icon: Truck,
  },
  {
    title: 'Consultá nuestras',
    subtitle: 'Tiendas',
    icon: Store,
  },
  {
    title: 'Contactanos',
    subtitle: 'Soporte Técnico',
    icon: Wrench,
  },
]

export function FeatureBar() {
  return (
    <div className="w-full flex justify-center -mt-16 z-20 relative">
      <div className="w-[80%] bg-[#f5f5f7] rounded-2xl shadow-md border border-[#e5e5e5] flex justify-between items-center py-6 px-6">
        {FEATURES.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="flex items-center gap-4 w-[20%] justify-center text-center"
            >
              <Icon size={28} className="text-gray-700" />

              <div className="text-left">
                <p className="text-[12px] text-gray-500">
                  {item.title}
                </p>
                <p className="text-[14px] font-semibold text-black">
                  {item.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}