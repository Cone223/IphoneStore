import { PrismaClient, IPhoneModel, StorageOption, Condition, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123456', 12)
  await prisma.user.upsert({
    where: { email: 'admin@iphonestore.com' },
    update: {},
    create: {
      name: 'Admin Store',
      email: 'admin@iphonestore.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  // Test user
  const userPassword = await bcrypt.hash('user123456', 12)
  await prisma.user.upsert({
    where: { email: 'usuario@test.com' },
    update: {},
    create: {
      name: 'Usuario Test',
      email: 'usuario@test.com',
      password: userPassword,
      role: Role.USER,
    },
  })

  // Products
  const products = [
    {
      name: 'iPhone 15 Pro Max 256GB Negro Titanio',
      slug: 'iphone-15-pro-max-256gb-negro',
      model: IPhoneModel.IPHONE_15_PRO_MAX,
      storage: StorageOption.GB_256,
      color: 'Negro Titanio',
      condition: Condition.NEW,
      price: 1899000,
      comparePrice: 2100000,
      description: `El iPhone 15 Pro Max es el iPhone más avanzado hasta la fecha. Con el chip A17 Pro, construido con tecnología de 3 nm, ofrece un rendimiento sin precedentes. El diseño de titanio grado 5 lo hace increíblemente liviano y resistente.\n\nEl sistema de cámara Pro incluye un sensor principal de 48 MP con estabilización óptica de imagen, ultra gran angular de 12 MP y teleobjetivo de 12 MP con zoom óptico 5x. El botón de Acción personalizable y el conector USB 3 completan una experiencia premium sin igual.`,
      shortDesc: 'El iPhone más potente con chip A17 Pro y cámara de 48MP',
      stock: 8,
      images: ['/products/15-pro-max-black-1.jpg', '/products/15-pro-max-black-2.jpg'],
      features: ['Chip A17 Pro', 'Pantalla Super Retina XDR 6.7"', 'Cámara 48MP', 'Titanio grado 5', 'USB 3', 'Botón de Acción'],
      isFeatured: true,
    },
    {
      name: 'iPhone 15 Pro 128GB Titanio Natural',
      slug: 'iphone-15-pro-128gb-natural',
      model: IPhoneModel.IPHONE_15_PRO,
      storage: StorageOption.GB_128,
      color: 'Titanio Natural',
      condition: Condition.NEW,
      price: 1599000,
      comparePrice: null,
      description: `El iPhone 15 Pro redefine lo que un smartphone puede hacer. Con el chip A17 Pro y el nuevo diseño en titanio, ofrece potencia profesional en un formato compacto. El zoom óptico 3x y las capacidades de ProRAW y ProRes lo convierten en la herramienta perfecta para creadores.`,
      shortDesc: 'Pro compacto con chip A17 Pro y diseño en titanio',
      stock: 12,
      images: ['/products/15-pro-natural-1.jpg'],
      features: ['Chip A17 Pro', 'Pantalla 6.1"', 'Zoom óptico 3x', 'Titanio natural', 'ProRAW y ProRes'],
      isFeatured: true,
    },
    {
      name: 'iPhone 15 128GB Verde',
      slug: 'iphone-15-128gb-verde',
      model: IPhoneModel.IPHONE_15,
      storage: StorageOption.GB_128,
      color: 'Verde',
      condition: Condition.NEW,
      price: 1199000,
      comparePrice: null,
      description: `El iPhone 15 llega con Dynamic Island y el potente chip A16 Bionic. La cámara principal de 48MP captura imágenes increíbles con detalle sin precedentes. La pantalla Super Retina XDR y la resistencia al agua IP68 lo hacen perfecto para el día a día.`,
      shortDesc: 'iPhone 15 con Dynamic Island y cámara 48MP',
      stock: 20,
      images: ['/products/15-verde-1.jpg'],
      features: ['Chip A16 Bionic', 'Dynamic Island', 'Cámara 48MP', 'Pantalla 6.1"', 'IP68'],
      isFeatured: false,
    },
    {
      name: 'iPhone 14 Pro 256GB Dorado Como Nuevo',
      slug: 'iphone-14-pro-256gb-dorado-usado',
      model: IPhoneModel.IPHONE_14_PRO,
      storage: StorageOption.GB_256,
      color: 'Dorado',
      condition: Condition.LIKE_NEW,
      price: 1099000,
      comparePrice: 1350000,
      description: `iPhone 14 Pro en estado impecable. Batería al 94% de capacidad. Incluye caja original, cargador y auriculares. Sin rayones ni marcas. Dynamic Island, chip A16 Bionic y sistema de cámara Pro con sensor de 48MP principal. Ideal para quienes buscan calidad Pro a precio accesible.`,
      shortDesc: 'Como nuevo, batería 94%, con caja original',
      stock: 3,
      images: ['/products/14-pro-gold-used-1.jpg'],
      features: ['Chip A16 Bionic', 'Dynamic Island', 'Cámara 48MP', 'Batería 94%', 'Con caja original'],
      isFeatured: true,
    },
    {
      name: 'iPhone 14 128GB Azul',
      slug: 'iphone-14-128gb-azul',
      model: IPhoneModel.IPHONE_14,
      storage: StorageOption.GB_128,
      color: 'Azul',
      condition: Condition.NEW,
      price: 999000,
      comparePrice: null,
      description: `El iPhone 14 con chip A15 Bionic y cámara dual de 12MP. Pantalla Super Retina XDR de 6.1 pulgadas, modo de acción para video y Detección de Accidentes. El smartphone completo para quienes buscan calidad Apple sin compromisos.`,
      shortDesc: 'iPhone 14 nuevo con chip A15 Bionic',
      stock: 15,
      images: ['/products/14-blue-1.jpg'],
      features: ['Chip A15 Bionic', 'Pantalla 6.1"', 'Cámara dual 12MP', 'Detección de Accidentes', 'IP68'],
      isFeatured: false,
    },
    {
      name: 'iPhone 13 Pro 256GB Grafito Excelente',
      slug: 'iphone-13-pro-256gb-grafito-usado',
      model: IPhoneModel.IPHONE_13_PRO,
      storage: StorageOption.GB_256,
      color: 'Grafito',
      condition: Condition.EXCELLENT,
      price: 849000,
      comparePrice: 999000,
      description: `iPhone 13 Pro en excelente estado. Batería al 89%. Pantalla ProMotion 120Hz. Triple cámara Pro con modo macro. Resistencia al agua IP68. Pequeñas marcas de uso apenas visibles. Ideal relación precio-calidad para un smartphone Pro.`,
      shortDesc: 'Excelente estado, batería 89%, pantalla ProMotion 120Hz',
      stock: 5,
      images: ['/products/13-pro-graphite-1.jpg'],
      features: ['Chip A15 Bionic', 'ProMotion 120Hz', 'Triple cámara Pro', 'Modo Macro', 'Batería 89%'],
      isFeatured: false,
    },
    {
      name: 'iPhone 13 128GB Rojo',
      slug: 'iphone-13-128gb-rojo',
      model: IPhoneModel.IPHONE_13,
      storage: StorageOption.GB_128,
      color: '(PRODUCT)RED',
      condition: Condition.GOOD,
      price: 699000,
      comparePrice: null,
      description: `iPhone 13 en buen estado general. Batería al 85%. Alguna marca de uso menor en la carcasa, pantalla impecable. Chip A15 Bionic, pantalla Super Retina XDR, cámara dual avanzada con modo Cinematográfico. Excelente opción de entrada al ecosistema Apple.`,
      shortDesc: 'Buen estado, batería 85%, pantalla impecable',
      stock: 7,
      images: ['/products/13-red-1.jpg'],
      features: ['Chip A15 Bionic', 'Modo Cinematográfico', 'Cámara dual', 'Batería 85%', 'Pantalla impecable'],
      isFeatured: false,
    },
    {
      name: 'iPhone 12 Pro Max 512GB Azul Pacífico',
      slug: 'iphone-12-pro-max-512gb-azul',
      model: IPhoneModel.IPHONE_12_PRO_MAX,
      storage: StorageOption.GB_512,
      color: 'Azul Pacífico',
      condition: Condition.EXCELLENT,
      price: 749000,
      comparePrice: null,
      description: `iPhone 12 Pro Max con el mayor almacenamiento disponible (512GB). Batería al 91%. MagSafe, pantalla Super Retina XDR 6.7", triple cámara Pro con LiDAR. Perfecto para quienes necesitan máximo espacio y potencia a un precio razonable.`,
      shortDesc: '512GB, batería 91%, MagSafe, triple cámara Pro',
      stock: 2,
      images: ['/products/12-pro-max-blue-1.jpg'],
      features: ['Chip A14 Bionic', 'MagSafe', '512GB', 'LiDAR', 'Batería 91%', 'Pantalla 6.7"'],
      isFeatured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Seed completado exitosamente!')
  console.log('📧 Admin: admin@iphonestore.com / admin123456')
  console.log('📧 Usuario: usuario@test.com / user123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
