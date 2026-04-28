import { Metadata } from 'next'
import { NosotrosClient } from '@/components/layout/NosotrosClient'

export const metadata: Metadata = {
  title: 'Nosotros — iPhoneStore',
  description: 'Conocé al equipo detrás de iPhoneStore. Tu tienda de confianza para iPhones nuevos y usados certificados en Argentina.',
}

export default function NosotrosPage() {
  return <NosotrosClient />
}
