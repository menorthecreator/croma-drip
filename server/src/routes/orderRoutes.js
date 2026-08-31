const express = require("express");

const {
  createOrder,
  getOrderByCode
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);

router.get("/:code", getOrderByCode);

module.exports = router;