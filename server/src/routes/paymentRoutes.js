const express = require("express");

const {
  mockPaymentWebhook
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/webhook/mock", mockPaymentWebhook);

module.exports = router;