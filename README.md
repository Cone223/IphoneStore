# 📱 iPhoneStore — Ecommerce de iPhones

Tienda online completa para venta de iPhones nuevos y usados. Stack: Next.js 14 App Router, PostgreSQL, Prisma, NextAuth, Tailwind CSS, Framer Motion, Zustand.

---

## 🚀 Setup en 5 pasos

### Paso 1 — Clonar e instalar dependencias

```bash
git clone https://github.com/tu-usuario/iphone-store.git
cd iphone-store
npm install
```

---

### Paso 2 — Configurar variables de entorno

```bash
cp .env.example .env
```

Editá `.env` con tus datos:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/iphone_store"

# NextAuth — generá un secret con: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui"

# WhatsApp (sin el + ni espacios, código de país incluido)
NEXT_PUBLIC_WHATSAPP_NUMBER="5491112345678"

# Datos de transferencia bancaria
NEXT_PUBLIC_CBU="0000003100012345678901"
NEXT_PUBLIC_ALIAS="iphone.store.ventas"
```

**PostgreSQL local con Docker (opcional):**
```bash
docker run --name iphone-store-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=iphone_store \
  -p 5432:5432 \
  -d postgres:15
```
DATABASE_URL sería: `postgresql://admin:admin123@localhost:5432/iphone_store`

---

### Paso 3 — Configurar la base de datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la DB
npm run db:push

# Cargar datos de prueba (productos + usuarios de demo)
npm run db:seed
```

Esto crea automáticamente:
- 8 productos de ejemplo (iPhones 11 al 15 Pro Max)
- **Admin:** `admin@iphonestore.com` / `admin123456`
- **Usuario:** `usuario@test.com` / `user123456`

---

### Paso 4 — Correr el proyecto

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

### Paso 5 — Explorar el proyecto

| URL | Descripción |
|-----|-------------|
| `/` | Home con hero, destacados y promos |
| `/catalog` | Catálogo con filtros avanzados |
| `/product/[slug]` | Detalle de producto |
| `/cart` | Carrito (drawer lateral) |
| `/checkout` | Proceso de compra |
| `/wishlist` | Lista de favoritos |
| `/profile` | Perfil y pedidos |
| `/auth/login` | Login |
| `/auth/register` | Registro |
| `/admin` | Panel admin (requiere rol ADMIN) |
| `/admin/products/new` | Crear producto |

---

## 🏗️ Arquitectura del proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout con providers
│   ├── page.tsx                  # Home page
│   ├── not-found.tsx             # 404
│   ├── catalog/page.tsx          # Catálogo con filtros (Server Component)
│   ├── product/[slug]/page.tsx   # Detalle de producto
│   ├── checkout/page.tsx         # Checkout completo
│   ├── wishlist/page.tsx         # Favoritos
│   ├── profile/page.tsx          # Perfil y pedidos
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/
│   │   ├── page.tsx              # Dashboard
│   │   └── products/
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── auth/register/        # Registro de usuarios
│       ├── products/             # CRUD productos
│       ├── orders/               # Gestión pedidos
│       └── recommendations/      # Motor de recomendaciones IA
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Navbar con búsqueda, carrito, usuario
│   │   ├── HeroSection.tsx       # Hero animado
│   │   ├── CategorySection.tsx   # Grid de categorías
│   │   └── PromoSection.tsx      # Banners y beneficios
│   ├── product/
│   │   ├── ProductCard.tsx       # Tarjeta de producto + skeleton
│   │   ├── ProductGrid.tsx       # Grid con sort y paginación
│   │   ├── ProductDetail.tsx     # Vista completa del producto
│   │   ├── CatalogFilters.tsx    # Sidebar de filtros
│   │   ├── FeaturedProducts.tsx  # Sección destacados
│   │   └── RelatedProducts.tsx   # Productos relacionados
│   ├── cart/
│   │   └── CartDrawer.tsx        # Drawer lateral del carrito
│   ├── admin/
│   │   ├── AdminDashboard.tsx    # Dashboard con métricas
│   │   └── ProductForm.tsx       # Form crear/editar producto
│   └── shared/
│       ├── Providers.tsx         # NextAuth + ReactQuery
│       ├── WhatsAppButton.tsx    # Botón flotante WhatsApp
│       └── ProfileClient.tsx     # Perfil con historial
│
├── lib/
│   ├── db/prisma.ts              # Cliente Prisma singleton
│   ├── auth/options.ts           # NextAuth config
│   ├── store/
│   │   ├── cart.ts               # Zustand store carrito
│   │   └── wishlist.ts           # Zustand store favoritos
│   └── utils/index.ts            # Helpers: formatPrice, slugify, etc.
│
├── types/index.ts                # TypeScript types
└── styles/globals.css            # Design system global
│
prisma/
├── schema.prisma                 # Schema completo
└── seed.ts                       # Datos de prueba
```

---

## ✨ Funcionalidades implementadas

### Cliente
- [x] Home con hero animado, stats, categorías y promos
- [x] Catálogo con filtros (modelo, almacenamiento, estado, precio)
- [x] Buscador en tiempo real desde el navbar
- [x] Página de detalle con galería de imágenes
- [x] Carrito con drawer lateral (Zustand + persistencia local)
- [x] Wishlist con persistencia local
- [x] Checkout en 4 pasos (contacto → envío → pago → confirmación)
- [x] Compra por transferencia (muestra CBU/alias)
- [x] Compra por WhatsApp (genera link dinámico con detalle del pedido)
- [x] Registro e inicio de sesión (JWT + Credentials)
- [x] Perfil con historial de pedidos
- [x] Botón flotante de WhatsApp

### Admin
- [x] Dashboard con métricas (ventas, pedidos, stock)
- [x] Tabla de pedidos recientes con estados
- [x] CRUD completo de productos
- [x] Activar/desactivar productos (soft delete)
- [x] Destacar productos para mostrar en home

### Técnico
- [x] SEO básico (metadata dinámica por página)
- [x] Skeleton loading en cards
- [x] Notificaciones toast (react-hot-toast)
- [x] Dark mode por defecto
- [x] Mobile-first, responsive
- [x] Animaciones con Framer Motion
- [x] Server Components para fetch de datos
- [x] API Routes tipadas con TypeScript
- [x] Protección de rutas por rol (admin/user)
- [x] Motor de recomendaciones sin ML (score-based)
- [x] Paginación en catálogo
- [x] Validación de stock en checkout

---

## 🔌 Integraciones futuras (preparado)

### MercadoPago
```typescript
// src/app/api/checkout/mercadopago/route.ts
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: Request) {
  const { items } = await req.json()
  const preference = new Preference(client)
  const result = await preference.create({ body: { items, back_urls: { ... } } })
  return Response.json({ init_point: result.init_point })
}
```

### Stripe
```typescript
// src/app/api/checkout/stripe/route.ts
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await stripe.checkout.sessions.create({ ... })
  return Response.json({ url: session.url })
}
```

### Sistema de cupones (schema listo para extender)
```prisma
model Coupon {
  id         String   @id @default(cuid())
  code       String   @unique
  discount   Float
  type       CouponType
  maxUses    Int
  usedCount  Int      @default(0)
  expiresAt  DateTime?
}
```

---

## ☁️ Deploy en Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables de entorno en el dashboard de Vercel:
#    DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, etc.

# 4. Ejecutar migrations en producción
vercel env pull .env.production
npx prisma db push
npx tsx prisma/seed.ts
```

**Base de datos recomendada para producción:** Neon, Supabase, o Railway (PostgreSQL gestionado).

---

## 🛠️ Comandos útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run db:studio    # Abrir Prisma Studio (GUI para la DB)
npm run db:push      # Sincronizar schema con la DB
npm run db:seed      # Cargar datos de prueba
npm run db:generate  # Regenerar cliente Prisma
npm run lint         # Lint del código
```

---

## 📦 Variables de entorno en producción

En Vercel Dashboard → Settings → Environment Variables:

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | URL del sitio (ej: `https://tu-tienda.vercel.app`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | Número WA sin + ni espacios |
| `NEXT_PUBLIC_CBU` | ✅ | CBU para transferencias |
| `NEXT_PUBLIC_ALIAS` | ✅ | Alias bancario |
| `GOOGLE_CLIENT_ID` | Opcional | OAuth con Google |
| `GOOGLE_CLIENT_SECRET` | Opcional | OAuth con Google |

---

## 🔐 Roles y accesos

| Ruta | Público | Usuario | Admin |
|------|---------|---------|-------|
| `/` | ✅ | ✅ | ✅ |
| `/catalog` | ✅ | ✅ | ✅ |
| `/product/:slug` | ✅ | ✅ | ✅ |
| `/checkout` | Parcial | ✅ | ✅ |
| `/profile` | ❌ | ✅ | ✅ |
| `/wishlist` | ✅ | ✅ | ✅ |
| `/admin` | ❌ | ❌ | ✅ |
| `POST /api/products` | ❌ | ❌ | ✅ |
| `PATCH /api/products/:id` | ❌ | ❌ | ✅ |
| `DELETE /api/products/:id` | ❌ | ❌ | ✅ |
#   I p h o n e S t o r e  
 