const MockPaymentProvider =
  require("./mockPaymentProvider");

class PaymentService {

  constructor() {
    this.provider =
      new MockPaymentProvider();
  }

  async createPayment({
    order,
    customer
  }) {

    if (!order) {
      throw new Error(
        "ORDER_REQUIRED"
      );
    }

    return this.provider
      .createPayment({
        orderCode:
          order.code,

        amount:
          Number(order.total),

        customer
      });
  }

  async getPayment(paymentId) {

    if (!paymentId) {
      throw new Error(
        "PAYMENT_ID_REQUIRED"
      );
    }

    return this.provider
      .getPayment(
        paymentId
      );
  }

}

module.exports =
  new PaymentService();