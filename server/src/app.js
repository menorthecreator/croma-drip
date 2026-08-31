const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Rota principal
app.get("/", (req, res) => {
  res.send("Croma Drip API Online");
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "croma-api",
    message: "Croma Drip API funcionando"
  });
});

module.exports = app;