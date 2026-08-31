const express =
  require("express");

const {
  createPayment,
  mockPaymentWebhook
} =
  require(
    "../controllers/paymentController"
  );

const router =
  express.Router();

router.post(
  "/create",
  createPayment
);

router.post(
  "/webhook/mock",
  mockPaymentWebhook
);

module.exports =
  router;