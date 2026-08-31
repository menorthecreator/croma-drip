import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./src/prisma/schema.json" with { type: "json" };

const db = postgres({
  contractJson,
  url: process.env.DATABASE_URL,
});

async function main() {
  console.log("Criando NØ CAP VOL.01...");

 const noCap = await db.orm.public.Product.create({
  slug: "no-cap-vol01",
  name: "Nø Cap Vol.01",
  displayName: "NØ CAP VOL.01",
  description:
    "Nø Cap Vol.01 confeccionado em camurça, com acabamento Croma Drip e fechamento regulável.",
  category: "CROMA DRIP",
  price: 112,
  material: "Camurça",
  active: true,
  trackStock: true,

  images: {
    front: "assets/produtos/no-cap-vol01/front.png",
    side: "assets/produtos/no-cap-vol01/side.png",
    back: "assets/produtos/no-cap-vol01/back.png"
  },

  viewerImages: [
    "assets/produtos/no-cap-vol01/side.png",
    "assets/produtos/no-cap-vol01/front.png",
    "assets/produtos/no-cap-vol01/back.png"
  ],

  details: {
    material: "Camurça",
    height: "17 cm",
    circumference: "58 a 62 cm",
    size: "Único ajustável"
  }
});

  await db.orm.public.ProductVariant.create({
  productId: noCap.id,
  sku: "CROMA-NOCAP01-UNICO",
  name: "ÚNICO",
  stock: 8,
  active: true
});

  console.log("Criando CROMA FURAC�O...");

  const furacao = await db.orm.public.Product.create({
  slug: "croma-furacao",
  name: "Croma Furacão",
  displayName: "CROMA FURACÃO",
  description:
    "Croma Furacão confeccionada em tecido rico em elastano, proporcionando maior capacidade e flexibilidade. Uma peça autoral com bordado exclusivo e acabamento Croma Drip.",
  category: "CROMA DRIP",
  price: 299.90,
  material: "Tecido com elastano",
  active: true,
  trackStock: true,

  images: {
    front: "assets/produtos/croma-furacao/front.png",
    side: "assets/produtos/croma-furacao/side.png",
    back: "assets/produtos/croma-furacao/detail.png"
  },

  viewerImages: [
    "assets/produtos/croma-furacao/front.png",
    "assets/produtos/croma-furacao/side.png",
    "assets/produtos/croma-furacao/detail.png"
  ],

  details: {
    material: "Tecido com elastano",
    dimensions: "33 × 23 cm",
    internalPockets: "Bolsos internos",
    externalPocket: "Bolso externo com zíper de 20 cm",
    embroidery: "Bordado exclusivo"
  }
});

await db.orm.public.ProductVariant.create({
  productId: furacao.id,
  sku: "CROMA-FURACAO-UNICO",
  name: "ÚNICO",
  stock: 0,
  active: true
});


  console.log("Seed conclu�do.");
}

await main();
