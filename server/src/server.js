require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
=================================
        CROMA DRIP API
=================================

Status: ONLINE
Porta: ${PORT}
Ambiente: ${process.env.NODE_ENV || "development"}

http://localhost:${PORT}

=================================
  `);
});