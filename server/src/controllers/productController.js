async function getProducts(req, res) {
  try {
    const { db } = await import("../prisma/db.mts");

    const products = await db.orm.public.Product.all();
    const variants = await db.orm.public.ProductVariant.all();

    const normalizedProducts = products.map((product) => {
      const productVariants = variants
        .filter((variant) => variant.productId === product.id)
        .filter((variant) => variant.active)
        .map((variant) => ({
          id: variant.sku.includes("UNICO")
            ? "unico"
            : variant.sku.toLowerCase(),

          name: variant.name,
          stock: Number(variant.stock),
          sku: variant.sku
        }));

      return {
        id: product.slug,
        databaseId: product.id,
        name: product.name,
        displayName: product.displayName,
        category: product.category,
        price: Number(product.price),
        active: product.active,
        trackStock: product.trackStock,

        images: product.images,
        viewerImages: product.viewerImages,

        description: product.description,
        details: product.details,

        sizes: productVariants
      };
    });

    return res.status(200).json({
      success: true,
      products: normalizedProducts
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar produtos."
    });
  }
}

async function getProductBySlug(req, res) {
  try {
    const { db } = await import("../prisma/db.mts");

    const { slug } = req.params;

    const products = await db.orm.public.Product.all();
    const variants = await db.orm.public.ProductVariant.all();

    const product = products.find(
      (item) => item.slug === slug
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado."
      });
    }

    const productVariants = variants
      .filter((variant) => variant.productId === product.id)
      .filter((variant) => variant.active)
      .map((variant) => ({
        id: variant.sku.includes("UNICO")
          ? "unico"
          : variant.sku.toLowerCase(),

        name: variant.name,
        stock: Number(variant.stock),
        sku: variant.sku
      }));

    const normalizedProduct = {
      id: product.slug,
      databaseId: product.id,
      name: product.name,
      displayName: product.displayName,
      category: product.category,
      price: Number(product.price),
      active: product.active,
      trackStock: product.trackStock,

      images: product.images,
      viewerImages: product.viewerImages,

      description: product.description,
      details: product.details,

      sizes: productVariants
    };

    return res.status(200).json({
      success: true,
      product: normalizedProduct
    });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar produto."
    });
  }
}

module.exports = {
  getProducts,
  getProductBySlug
};