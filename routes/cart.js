const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart");
const middleware = require("../customMiddleware/auth");

router.post("/add-item", cartController.addToCart);
router.get(
  "/get-by-user-id",
  middleware.requiresLogin,
  cartController.getByUserId
);
router.post("/update-quantity", cartController.updateItemQuantity);
router.delete("/delete-item", cartController.deleteItem);

module.exports = router;
