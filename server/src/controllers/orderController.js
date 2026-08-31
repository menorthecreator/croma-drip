async function createOrder(req, res) {
  try {
    const { db } = await import("../prisma/db.mts");

    const { customer, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "O pedido precisa ter pelo menos um item."
      });
    }

    const products = await db.orm.public.Product.all();
    const variants = await db.orm.public.ProductVariant.all();

    const preparedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantidade inválida."
        });
      }

      const product = products.find(
        (product) =>
          product.slug === item.productId &&
          product.active
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produto não encontrado: ${item.productId}`
        });
      }

      const productVariants = variants.filter(
        (variant) =>
          variant.productId === product.id &&
          variant.active
      );

      let variant = null;

      if (item.sizeId) {
        variant = productVariants.find((variant) => {
          const normalizedId = variant.sku.includes("UNICO")
            ? "unico"
            : variant.sku.toLowerCase();

          return normalizedId === item.sizeId;
        });
      }

      if (!variant && productVariants.length === 1) {
        variant = productVariants[0];
      }

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variação inválida para ${product.name}.`
        });
      }

      if (
        product.trackStock &&
        Number(variant.stock) < quantity
      ) {
        return res.status(409).json({
          success: false,
          message: `Estoque insuficiente para ${product.name}.`
        });
      }

      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * quantity;

      subtotal += totalPrice;

      preparedItems.push({
        product,
        variant,
        quantity,
        unitPrice,
        totalPrice
      });
    }

    const orderCode = `CROMA-${Date.now()}`;

    const order = await db.orm.public.Order.create({
      code: orderCode,
      status: "pending",
      subtotal,
      total: subtotal,

      customerName: customer?.name || null,
      customerEmail: customer?.email || null,
      customerPhone: customer?.phone || null
    });

    for (const item of preparedItems) {
      await db.orm.public.OrderItem.create({
        orderId: order.id,
        productId: item.product.id,
        variantId: item.variant.id,

        productName: item.product.name,
        variantName: item.variant.name,
        sku: item.variant.sku,

        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      });
    }

    return res.status(201).json({
      success: true,
      order: {
        id: order.id,
        code: order.code,
        status: order.status,
        subtotal: Number(order.subtotal),
        total: Number(order.total)
      }
    });

  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar pedido."
    });
  }
}

async function getOrderByCode(req, res) {
  try {
    const { db } = await import("../prisma/db.mts");

    const { code } = req.params;

    const orders = await db.orm.public.Order.all();
    const orderItems = await db.orm.public.OrderItem.all();

    const order = orders.find(
      (item) => item.code === code
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado."
      });
    }

    const items = orderItems
      .filter((item) => item.orderId === order.id)
      .map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        sku: item.sku,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice)
      }));

    return res.status(200).json({
      success: true,

      order: {
        id: order.id,
        code: order.code,
        status: order.status,

        customer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone
        },

        subtotal: Number(order.subtotal),
        total: Number(order.total),

        items,

        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error("Erro ao buscar pedido:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedido."
    });
  }
}

module.exports = {
  createOrder,
  getOrderByCode
};