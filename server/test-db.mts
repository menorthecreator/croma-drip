import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./src/prisma/schema.json" with { type: "json" };

const db = postgres({
  contractJson,
  url: process.env.DATABASE_URL,
});

const products = await db.orm.public.Product.all();
const variants = await db.orm.public.ProductVariant.all();

console.log("Produtos no banco:", products);
console.log("Variantes no banco:", variants);