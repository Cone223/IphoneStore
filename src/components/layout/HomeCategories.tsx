'use client'

import Link from 'next/link'

const CATEGORIES = [
  { name: 'Mac', image: '/images/mac.png' },
  { name: 'iPhone', image: '/images/iphone.png' },
  { name: 'iPad', image: '/images/ipad.png' },
  { name: 'Apple Watch', image: '/images/watch.png' },
  { name: 'AirPods', image: '/images/airpods.png' },
  { name: 'AirTag', image: '/images/airtag.png' },
  { name: 'Apple TV', image: '/images/tv.png' },
  { name: 'Accesorios', image: '/images/accessories.png' },
]

export function HomeCategories() {
  return (
    <section className="bg-[#f5f5f7] py-10">
      <div className="w-[90%] mx-auto flex justify-between items-center gap-6 flex-wrap">
        {CATEGORIES.map((cat, i) => (
          <div
            key={i}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src={cat.image}
              className="h-[70px] object-contain mb-3 group-hover:scale-110 transition"
            />
            <p className="text-[13px] text-black font-medium">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}