const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const middleware = require("../customMiddleware/auth");

router.post("/create", middleware.requiresLogin, orderController.createOrder);
router.get(
  "/get-all-order",
  middleware.requiresLogin,
  orderController.getAllOrder
);
router.get(
  "/get-order-by-id",
  middleware.requiresLogin,
  orderController.getOrderById
);

module.exports = router;
