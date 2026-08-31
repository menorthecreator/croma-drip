const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Croma Drip API Online");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "croma-api",
    message: "Croma Drip API funcionando"
  });
});

module.exports = app;