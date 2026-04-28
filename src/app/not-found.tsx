import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-[80px] font-serif text-[#1a1a1a] leading-none mb-4">404</p>
        <h1 className="font-serif text-2xl text-white mb-2">Página no encontrada</h1>
        <p className="text-[13px] text-[#555] mb-8 max-w-xs mx-auto">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-black text-[13px] font-medium rounded-lg hover:bg-[#e0c06e] transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
