import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seeding...")

  // Clear only product-related data
  await clearProductData()

  // Seed only admin and owner users
  await seedAdminUsers()

  // Seed products
  await seedProducts()

  // Seed aromas
  await seedAromas()

  // Seed bones
  await seedBones()

  // Seed product colors
  await seedProductColors()

  console.log("Seeding completed successfully!")
}

async function clearProductData() {
  console.log("Clearing existing product data...")

  // Modified deletion order to handle foreign key constraints
  await prisma.cartItem.deleteMany({
    where: {
      productId: {
        not: undefined,
      },
    },
  })
  await prisma.productColor.deleteMany({})
  await prisma.modifiedBone.deleteMany({})
  await prisma.bone.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.aroma.deleteMany({})
}

async function seedAdminUsers() {
  console.log("Seeding admin users...")

  // Check if users already exist to avoid duplicates
  const existingOwner = await prisma.user.findFirst({ where: { email: "admin@email" } })
  const existingAdmin = await prisma.user.findFirst({ where: { email: "admin22@email" } })

  if (!existingOwner) {
    await prisma.user.create({
      data: {
        name: "ADMIN NAJA",
        email: "admin@email",
        password: "$2b$10$qmr09mQMVW6i7n9Yd9ubZur8bsjrxtyYnz1c4MBiN2VTxqZhaWwJe",
        tel: "+661111",
        address: "",
        role: "OWNER",
        loginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: "http://localhost:5000/uploads/profile-images/726a456e-fe09-4db7-9391-eebb204c198b.gif",
      },
    })
    console.log("Created owner user")
  } else {
    console.log("Owner user already exists, skipping")
  }

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "moodeng1234 rt",
        email: "admin22@email",
        password: "$2b$10$YSFZbA2gC4MwJKbnHZrt8eDGsJ82vrLvKoIsCR30WRK0DKhDlyxpq",
        tel: "+6613906933",
        address: "",
        role: "ADMIN",
        loginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    console.log("Created admin user")
  } else {
    console.log("Admin user already exists, skipping")
  }
}

async function seedProducts() {
  console.log("Seeding products...")

  const products = [
    {
      id: 1,
      name: "YADOM KRAPOOK-YAII",
      description:
        "Premium inhaler designed specifically for aromatherapy. Features interchangeable aroma cartridges and customizable exterior.",
      price: 129.99,
      type: "MAIN_PRODUCT",
      localUrl: "src/assets/models/model1",
      createdAt: new Date("2025-03-31 18:46:05.379"),
      updatedAt: new Date("2025-03-31 18:46:05.379"),
      status: "AVAILABLE",
    },
    {
      id: 2,
      name: "YADOM YANUT MOAME",
      description:
        "A premium Thai inhaler blending centuries-old herbal wisdom with a sleek, customizable design for an elevated aromatherapy experience.",
      price: 159.99,
      type: "MAIN_PRODUCT",
      localUrl: "src/assets/models/model2",
      createdAt: new Date("2025-03-31 18:54:25.808"),
      updatedAt: new Date("2025-03-31 18:54:25.808"),
      status: "AVAILABLE",
    },
    {
      id: 3,
      name: "YADOM TANGTANG",
      description:
        "Stay refreshed and energized with this interchangeable-cartridge inhaler, crafted for instant relief and relaxation anywhere, anytime.",
      price: 99.99,
      type: "MAIN_PRODUCT",
      localUrl: "src/assets/models/model3",
      createdAt: new Date("2025-03-31 19:03:23.234"),
      updatedAt: new Date("2025-03-31 19:03:23.234"),
      status: "AVAILABLE",
    },
    {
      id: 4,
      name: "YADOM TANGLOVELVOE",
      description: "Stay refreshed and energized with this love on the top of your breath.",
      price: 109.99,
      type: "MAIN_PRODUCT",
      localUrl: "src/assets/models/model4",
      createdAt: new Date("2025-03-31 19:14:12.097"),
      updatedAt: new Date("2025-03-31 19:14:12.097"),
      status: "AVAILABLE",
    },
    {
      id: 5,
      name: "YADOM KRAPOOK-LEK",
      description:
        "Designed for those who seek calm, clarity, and revitalization, this premium inhaler is your go-to aromatherapy essential.",
      price: 89.99,
      type: "MAIN_PRODUCT",
      localUrl: "src/assets/models/model5",
      createdAt: new Date("2025-03-31 19:17:00.844"),
      updatedAt: new Date("2025-03-31 19:17:00.844"),
      status: "AVAILABLE",
    },
    {
      id: 6,
      name: "YADOM WITH PASTEL",
      description:
        "A stylish, configurable Thai inhaler with swappable aromas, designed to match your mood and lifestyle effortlessly.",
      price: 89.99,
      type: "MAIN_PRODUCT",
      localUrl: "src/assets/models/model6",
      createdAt: new Date("2025-03-31 19:19:45.271"),
      updatedAt: new Date("2025-03-31 19:19:45.271"),
      status: "AVAILABLE",
    },
    // Accessories (7-15)
    {
      id: 7,
      name: "Dual Port Adapter",
      description:
        "Convenient dual port adapter for your inhaler. This accessory allows for two inhalation ports, making it perfect for sharing or for backup use. Made from high-quality, medical-grade materials.",
      price: 12.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/7",
      createdAt: new Date("2025-03-31 19:39:17.457"),
      updatedAt: new Date("2025-03-31 19:39:17.457"),
      status: "AVAILABLE",
    },
    {
      id: 8,
      name: "Bow Charm Keychain",
      description:
        "Elegant bow charm keychain for your inhaler. Features a delicate bow design on a flower-shaped base with a durable ball chain and clip attachment. Perfect for adding a touch of style to your essential medical device.",
      price: 8.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/8",
      createdAt: new Date("2025-03-31 19:41:28.764"),
      updatedAt: new Date("2025-03-31 19:41:28.764"),
      status: "AVAILABLE",
    },
    {
      id: 9,
      name: "Paw Print Keychain",
      description:
        "Adorable paw print charm keychain for pet lovers. Features a cute paw design on a flower-shaped base with a colorful ball chain and clip attachment. A perfect accessory for animal lovers to personalize their inhaler.",
      price: 8.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/9",
      createdAt: new Date("2025-03-31 19:41:34.454"),
      updatedAt: new Date("2025-03-31 19:41:34.454"),
      status: "AVAILABLE",
    },
    {
      id: 10,
      name: "Comfort Lanyard",
      description:
        "Soft and comfortable lanyard for your inhaler. This lightweight lanyard allows you to keep your inhaler close at hand for quick access. Made from gentle, skin-friendly material that won't irritate sensitive skin.",
      price: 6.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/10",
      createdAt: new Date("2025-03-31 19:41:39.635"),
      updatedAt: new Date("2025-03-31 19:41:39.635"),
      status: "AVAILABLE",
    },
    {
      id: 11,
      name: "Smiley Face Charm",
      description:
        "Cheerful smiley face charm to brighten your day. This fun accessory attaches easily to your inhaler, adding a touch of happiness to your essential medical device. Made from durable, lightweight material.",
      price: 4.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/11",
      createdAt: new Date("2025-03-31 19:41:44.160"),
      updatedAt: new Date("2025-03-31 19:41:44.160"),
      status: "AVAILABLE",
    },
    {
      id: 12,
      name: "Double Smiley Keychain",
      description:
        "Double the happiness with this twin smiley face keychain. Features two cheerful smiley charms on a flower-shaped base with a colorful ball chain and clip attachment. A fun way to personalize your inhaler.",
      price: 9.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/12",
      createdAt: new Date("2025-03-31 19:41:50.525"),
      updatedAt: new Date("2025-03-31 19:41:50.525"),
      status: "AVAILABLE",
    },
    {
      id: 13,
      name: "Moon Smile Keychain",
      description:
        "Dreamy moon smile keychain for your inhaler. Features a whimsical crescent moon with a smile on a flower-shaped base. Comes with a colorful ball chain and clip attachment for easy carrying.",
      price: 8.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/13",
      createdAt: new Date("2025-03-31 19:41:55.481"),
      updatedAt: new Date("2025-03-31 19:41:55.481"),
      status: "AVAILABLE",
    },
    {
      id: 14,
      name: "Smiley Charm Bracelet",
      description:
        "Playful charm bracelet with multiple colorful smiley faces. This fun accessory can be attached to your inhaler or worn as a bracelet. Features a translucent design with vibrant charms that add a pop of color to your day.",
      price: 11.99,
      type: "ACCESSORY",
      localUrl: "src/assets/images/shop/14",
      createdAt: new Date("2025-03-31 19:42:01.251"),
      updatedAt: new Date("2025-03-31 19:42:01.251"),
      status: "AVAILABLE",
    },
    {
      id: 15,
      name: "Fish Silhouette Charm",
      description:
        "Elegant fish silhouette charm for your inhaler. This minimalist design features a sleek fish cutout that adds a subtle decorative touch. Made from durable, lightweight material that won't add bulk to your device.",
      price: 5.99,
      type: "ACCESSORY",
      localUrl: "/src/assets/images/products/15.png",
      createdAt: new Date("2025-03-31 19:42:06.719"),
      updatedAt: new Date("2025-03-31 21:03:21.962"),
      status: "AVAILABLE",
    },
  ]

  for (const product of products) {
    // Convert field names to match the schema
    const productData = {
      ...product,
      // etc, if needed :)
    }

    await prisma.product.create({
      data: productData as any,
    })
  }

  console.log(`Created ${products.length} products`)
}

async function seedAromas() {
  console.log("Seeding aromas...")

  const aromas = [
    {
      id: 1,
      name: "Herb",
      description:
        "A refreshing blend of natural herbs with earthy undertones. Perfect for relaxation and stress relief.",
      price: 6.99,
      createdAt: new Date("2025-03-31 18:31:28.981"),
      updatedAt: new Date("2025-03-31 18:31:28.981"),
    },
    {
      id: 2,
      name: "Mint",
      description:
        "Crisp and invigorating peppermint aroma that provides a cooling sensation and helps clear the mind.",
      price: 5.99,
      createdAt: new Date("2025-03-31 18:31:32.712"),
      updatedAt: new Date("2025-03-31 18:31:32.712"),
    },
    {
      id: 3,
      name: "Earl Grey",
      description: "Sophisticated bergamot-infused tea aroma with subtle citrus notes. Elegant and calming.",
      price: 7.99,
      createdAt: new Date("2025-03-31 18:31:37.018"),
      updatedAt: new Date("2025-03-31 18:31:37.018"),
    },
    {
      id: 4,
      name: "Camphor",
      description:
        "Strong, medicinal aroma with cooling properties. Helps clear airways and provides a refreshing sensation.",
      price: 6.49,
      createdAt: new Date("2025-03-31 18:31:40.877"),
      updatedAt: new Date("2025-03-31 18:31:40.877"),
    },
    {
      id: 5,
      name: "Lavender",
      description: "Soothing floral aroma known for its calming and sleep-promoting properties. Ideal for evening use.",
      price: 8.99,
      createdAt: new Date("2025-03-31 18:31:44.334"),
      updatedAt: new Date("2025-03-31 18:31:44.334"),
    },
    {
      id: 6,
      name: "Fruity",
      description: "A vibrant blend of tropical fruits creating an uplifting and energizing aroma experience.",
      price: 7.49,
      createdAt: new Date("2025-03-31 18:31:48.107"),
      updatedAt: new Date("2025-03-31 18:31:48.107"),
    },
  ]

  for (const aroma of aromas) {
    await prisma.aroma.create({
      data: aroma as any,
    })
  }

  console.log(`Created ${aromas.length} aromas`)
}

async function seedBones() {
  console.log("Seeding bones...")

  const bones = [
    // Product 1 bones
    {
      id: 1,
      productId: 1,
      textId: null,
      name: "Body",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 2,
      productId: 1,
      textId: null,
      name: "body",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 3,
      productId: 1,
      textId: null,
      name: "customized-body",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 4,
      productId: 1,
      textId: null,
      name: "customized-top",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 5,
      productId: 1,
      textId: null,
      name: "top",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },

    // Product 2 bones
    {
      id: 6,
      productId: 2,
      textId: null,
      name: "body",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 7,
      productId: 2,
      textId: null,
      name: "body-bottom-smooth",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 8,
      productId: 2,
      textId: null,
      name: "body-top-smooth",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 9,
      productId: 2,
      textId: null,
      name: "customized-body",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 10,
      productId: 2,
      textId: null,
      name: "top",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },

    // Product 3 bones
    {
      id: 11,
      productId: 3,
      textId: null,
      name: "bottom",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 12,
      productId: 3,
      textId: null,
      name: "center",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 13,
      productId: 3,
      textId: null,
      name: "customized-bottom",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 14,
      productId: 3,
      textId: null,
      name: "customized-top",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 15,
      productId: 3,
      textId: null,
      name: "top",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },

    // Product 4 bones
    {
      id: 16,
      productId: 4,
      textId: null,
      name: "bottom",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 17,
      productId: 4,
      textId: null,
      name: "center",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 18,
      productId: 4,
      textId: null,
      name: "customized-bottom",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 19,
      productId: 4,
      textId: null,
      name: "customized-top",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 20,
      productId: 4,
      textId: null,
      name: "top",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },

    // Product 5 bones
    {
      id: 21,
      productId: 5,
      textId: null,
      name: "body",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 22,
      productId: 5,
      textId: null,
      name: "customized-body",
      defDetail: "#FFFFFF",
      defaultStyle: "COLOR",
      isConfiguration: false,
    },
    {
      id: 23,
      productId: 5,
      textId: null,
      name: "top",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },

    // Product 6 bones
    {
      id: 24,
      productId: 6,
      textId: null,
      name: "Mesh1",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
    {
      id: 25,
      productId: 6,
      textId: null,
      name: "Mesh1.003",
      defDetail: "#7FDBFF",
      defaultStyle: "COLOR",
      isConfiguration: true,
    },
  ]

  for (const bone of bones) {
    await prisma.bone.create({
      data: bone as any,
    })
  }

  console.log(`Created ${bones.length} bones`)
}

async function seedProductColors() {
  console.log("Seeding product colors...")

  // This is a subset of the product colors for brevity
  const productColors = [
    // Product 7 colors
    {
      id: 1,
      colorCode: "#B19CD9",
      colorName: "Lavender",
      productId: 7,
      createdAt: new Date("2025-03-31 19:39:17.494"),
      updatedAt: new Date("2025-03-31 19:39:17.494"),
    },
    {
      id: 2,
      colorCode: "#FFFFFF",
      colorName: "White",
      productId: 7,
      createdAt: new Date("2025-03-31 19:39:17.494"),
      updatedAt: new Date("2025-03-31 19:39:17.494"),
    },
    {
      id: 3,
      colorCode: "#87CEEB",
      colorName: "Sky Blue",
      productId: 7,
      createdAt: new Date("2025-03-31 19:39:17.494"),
      updatedAt: new Date("2025-03-31 19:39:17.494"),
    },

    // Product 8 colors
    {
      id: 4,
      colorCode: "#FFC0CB",
      colorName: "Pink",
      productId: 8,
      createdAt: new Date("2025-03-31 19:41:28.774"),
      updatedAt: new Date("2025-03-31 19:41:28.774"),
    },
    {
      id: 5,
      colorCode: "#FFFFFF",
      colorName: "White",
      productId: 8,
      createdAt: new Date("2025-03-31 19:41:28.774"),
      updatedAt: new Date("2025-03-31 19:41:28.774"),
    },
    {
      id: 6,
      colorCode: "#90EE90",
      colorName: "Light Green",
      productId: 8,
      createdAt: new Date("2025-03-31 19:41:28.774"),
      updatedAt: new Date("2025-03-31 19:41:28.774"),
    },
    {
      id: 7,
      colorCode: "#ADD8E6",
      colorName: "Light Blue",
      productId: 8,
      createdAt: new Date("2025-03-31 19:41:28.774"),
      updatedAt: new Date("2025-03-31 19:41:28.774"),
    },

    // Product 11 colors (important ones used in cart items)
    {
      id: 16,
      colorCode: "#FFFF00",
      colorName: "Bright Yellow",
      productId: 11,
      createdAt: new Date("2025-03-31 19:41:44.166"),
      updatedAt: new Date("2025-03-31 19:41:44.166"),
    },
    {
      id: 17,
      colorCode: "#FF69B4",
      colorName: "Hot Pink",
      productId: 11,
      createdAt: new Date("2025-03-31 19:41:44.166"),
      updatedAt: new Date("2025-03-31 19:41:44.166"),
    },

    // Product 13 colors
    {
      id: 25,
      colorCode: "#B19CD9",
      colorName: "Lavender",
      productId: 13,
      createdAt: new Date("2025-03-31 19:41:55.489"),
      updatedAt: new Date("2025-03-31 19:41:55.489"),
    },

    // Product 14 colors
    {
      id: 26,
      colorCode: "#FFD1DC",
      colorName: "Pastel Pink",
      productId: 14,
      createdAt: new Date("2025-03-31 19:42:01.262"),
      updatedAt: new Date("2025-03-31 19:42:01.262"),
    },
  ]

  for (const color of productColors) {
    await prisma.productColor.create({
      data: color as any,
    })
  }

  console.log(`Created ${productColors.length} product colors`)
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

