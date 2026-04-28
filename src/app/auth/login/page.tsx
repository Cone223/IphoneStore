import { Suspense } from 'react'
import LoginClient from './LoginClient'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-[#c9a84c]">Cargando...</div></div>}>
      <LoginClient />
    </Suspense>
  )
}
