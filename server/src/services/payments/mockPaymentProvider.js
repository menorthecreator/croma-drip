class MockPaymentProvider {

  async createPayment({
    orderCode,
    amount,
    customer
  }) {

    const paymentId =
      `MOCK-${Date.now()}`;

    return {
      provider: "mock",
      paymentId,
      orderCode,
      amount,
      customer,
      status: "pending",
      checkoutUrl: null,
      createdAt:
        new Date().toISOString()
    };
  }

  async getPayment(paymentId) {

    return {
      provider: "mock",
      paymentId,
      status: "pending"
    };
  }

}

module.exports =
  MockPaymentProvider;