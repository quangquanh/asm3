const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");

router.get("/all", productController.getAllProduct);
router.get("/detail", productController.getProductDetail);

module.exports = router;
