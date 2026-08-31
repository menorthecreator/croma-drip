const paymentService =
  require(
    "../services/payments/paymentService"
  );
async function mockPaymentWebhook(req, res) {
  try {
    const { db } = await import("../prisma/db.mts");

    const {
      orderCode,
      paymentId,
      paymentStatus
    } = req.body;

    if (!orderCode || !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "orderCode e paymentStatus são obrigatórios."
      });
    }

    const normalizedStatus = String(paymentStatus)
      .trim()
      .toLowerCase();

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
      "cancelled"
    ];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status de pagamento inválido."
      });
    }

    const orders = await db.orm.public.Order.all();

    const existingOrder = orders.find(
      (item) => item.code === orderCode
    );

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado."
      });
    }

    /*
    =====================================
    PAGAMENTO AINDA NÃO APROVADO
    =====================================
    */

    if (normalizedStatus !== "approved") {
      let orderStatus = "payment_pending";

      if (
        normalizedStatus === "cancelled" ||
        normalizedStatus === "rejected"
      ) {
        orderStatus = "cancelled";
      }

      const updatedOrder = await db.orm.public.Order
        .where({
          id: existingOrder.id
        })
        .update({
          status: orderStatus,
          paymentProvider: "mock",
          paymentId: paymentId || null,
          paymentStatus: normalizedStatus
        });

      return res.status(200).json({
        success: true,
        message: "Webhook processado com sucesso.",

        inventoryProcessed:
          updatedOrder.inventoryProcessed,

        order: {
          id: updatedOrder.id,
          code: updatedOrder.code,
          status: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus
        }
      });
    }

    /*
    =====================================
    PAGAMENTO APROVADO
    =====================================
    */

    const result = await db.transaction(async (tx) => {

      /*
      Busca novamente dentro da transação.
      */

      const txOrders =
        await tx.orm.public.Order.all();

      const order = txOrders.find(
        (item) => item.code === orderCode
      );

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      /*
      =====================================
      IDEMPOTÊNCIA
      =====================================

      Se já processamos o estoque desse
      pedido, NÃO descontamos novamente.
      */

      if (order.inventoryProcessed) {

        const updatedOrder =
          await tx.orm.public.Order
            .where({
              id: order.id
            })
            .update({
              status: "paid",
              paymentProvider: "mock",
              paymentId:
                paymentId ||
                order.paymentId ||
                null,
              paymentStatus: "approved",
              paidAt:
                order.paidAt ||
                new Date().toISOString()
            });

        return {
          order: updatedOrder,
          inventoryAlreadyProcessed: true
        };
      }

      /*
      =====================================
      ITENS DO PEDIDO
      =====================================
      */

      const allOrderItems =
        await tx.orm.public.OrderItem.all();

      const orderItems =
        allOrderItems.filter(
          (item) => item.orderId === order.id
        );

      if (orderItems.length === 0) {
        throw new Error("ORDER_WITHOUT_ITEMS");
      }

      /*
      =====================================
      VALIDA ESTOQUE
      =====================================
      */

      const allVariants =
        await tx.orm.public.ProductVariant.all();

      const stockOperations = [];

      for (const item of orderItems) {

        const variant =
          allVariants.find(
            (variant) =>
              variant.id === item.variantId
          );

        if (!variant) {
          throw new Error(
            `VARIANT_NOT_FOUND:${item.sku}`
          );
        }

        const currentStock =
          Number(variant.stock);

        const quantity =
          Number(item.quantity);

        if (currentStock < quantity) {
          throw new Error(
            `INSUFFICIENT_STOCK:${item.productName}`
          );
        }

        stockOperations.push({
          item,
          variant,
          quantity,
          newStock:
            currentStock - quantity
        });
      }

      /*
      =====================================
      BAIXA DE ESTOQUE
      =====================================
      */

      for (const operation of stockOperations) {

        await tx.orm.public.ProductVariant
          .where({
            id: operation.variant.id
          })
          .update({
            stock: operation.newStock
          });

        /*
        ===================================
        HISTÓRICO DE ESTOQUE
        ===================================
        */

        await tx.orm.public.InventoryMovement
          .create({
            variantId:
              operation.variant.id,

            quantity:
              -operation.quantity,

            type: "sale",

            reason:
              "Pagamento aprovado",

            reference:
              order.code
          });
      }

      /*
      =====================================
      MARCA PEDIDO COMO PROCESSADO
      =====================================
      */

      const updatedOrder =
        await tx.orm.public.Order
          .where({
            id: order.id
          })
          .update({
            status: "paid",

            paymentProvider: "mock",

            paymentId:
              paymentId || null,

            paymentStatus: "approved",

            paidAt:
              order.paidAt ||
              new Date().toISOString(),

            inventoryProcessed: true
          });

      return {
        order: updatedOrder,
        inventoryAlreadyProcessed: false
      };
    });

    /*
    =====================================
    RESPOSTA
    =====================================
    */

    return res.status(200).json({
      success: true,

      message:
        result.inventoryAlreadyProcessed
          ? "Webhook já havia sido processado. Estoque mantido."
          : "Pagamento aprovado e estoque atualizado.",

      inventoryProcessed: true,

      inventoryAlreadyProcessed:
        result.inventoryAlreadyProcessed,

      order: {
        id: result.order.id,
        code: result.order.code,
        status: result.order.status,

        paymentProvider:
          result.order.paymentProvider,

        paymentId:
          result.order.paymentId,

        paymentStatus:
          result.order.paymentStatus,

        paidAt:
          result.order.paidAt
      }
    });

  } catch (error) {
    console.error(
      "Erro no webhook mock:",
      error
    );

    /*
    =====================================
    ERROS CONTROLADOS
    =====================================
    */

    if (
      error.message.startsWith(
        "INSUFFICIENT_STOCK:"
      )
    ) {
      const productName =
        error.message.split(":")[1];

      return res.status(409).json({
        success: false,
        message:
          `Estoque insuficiente para ${productName}.`
      });
    }

    if (
      error.message.startsWith(
        "VARIANT_NOT_FOUND:"
      )
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Variação do pedido não encontrada."
      });
    }

    if (
      error.message ===
      "ORDER_WITHOUT_ITEMS"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pedido não possui itens."
      });
    }

    if (
      error.message ===
      "ORDER_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Pedido não encontrado."
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Erro ao processar webhook."
    });
  }
}
async function createPayment(
  req,
  res
) {

  try {

    const { db } =
      await import(
        "../prisma/db.mts"
      );

    const {
      orderCode
    } = req.body;


    if (!orderCode) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "orderCode é obrigatório."

        });

    }


    const orders =
      await db.orm.public.Order.all();


    const order =
      orders.find(
        item =>
          item.code ===
          orderCode
      );


    if (!order) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Pedido não encontrado."

        });

    }


    if (
      order.status ===
      "paid"
    ) {

      return res
        .status(409)
        .json({

          success: false,

          message:
            "Este pedido já está pago."

        });

    }


    const payment =
      await paymentService
        .createPayment({

          order,

          customer: {

            name:
              order.customerName,

            email:
              order.customerEmail,

            phone:
              order.customerPhone

          }

        });


    const updatedOrder =
      await db.orm.public.Order
        .where({
          id: order.id
        })
        .update({

          status:
            "payment_pending",

          paymentProvider:
            payment.provider,

          paymentId:
            payment.paymentId,

          paymentStatus:
            payment.status

        });


    return res
      .status(201)
      .json({

        success: true,

        payment,

        order: {

          id:
            updatedOrder.id,

          code:
            updatedOrder.code,

          status:
            updatedOrder.status,

          paymentProvider:
            updatedOrder
              .paymentProvider,

          paymentId:
            updatedOrder
              .paymentId,

          paymentStatus:
            updatedOrder
              .paymentStatus

        }

      });

  } catch (error) {

    console.error(
      "Erro ao criar pagamento:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Erro ao criar pagamento."

      });

  }

}

module.exports = {
  createPayment,
  mockPaymentWebhook
};