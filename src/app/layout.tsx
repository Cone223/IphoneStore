import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/components/shared/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import '@/styles/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'iPhoneStore — iPhones Nuevos y Usados',
    template: '%s | iPhoneStore',
  },
  description:
    'Comprá iPhones nuevos y usados certificados con garantía. iPhone 15, 14, 13, 12 y más. Envío a todo el país. Pago por transferencia o WhatsApp.',
  keywords: ['iPhone', 'iPhone usado', 'iPhone nuevo', 'comprar iPhone', 'iPhone Argentina'],
  openGraph: {
    title: 'iPhoneStore — iPhones Nuevos y Usados',
    description: 'Comprá iPhones nuevos y usados certificados con garantía.',
    type: 'website',
    locale: 'es_AR',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={dmSans.variable} suppressHydrationWarning>
      <body className="bg-white text-[#1d1d1f] font-sans antialiased min-h-screen">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <CartDrawer />
          <WhatsAppButton />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#1d1d1f',
                border: '1px solid #d2d2d7',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
