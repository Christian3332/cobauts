const express = require("express");
const usersRoutes = require("./components/users/users-route");
const transportRoutes = require("./components/transport/transport-route");
const paymentRoutes = require("./components/payment/payment-route");

module.exports = () => {
  const app = express.Router();

  app.use("/users", usersRoutes());
  app.use("/transport", transportRoutes());
  app.use("/payment", paymentRoutes());
  return app;
};
