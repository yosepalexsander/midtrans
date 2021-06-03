const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
  getProduct,
  orderProduct,
} = require("../controllers/products");
const {
  getTransactions,
  addTransaction,
  notification,
  sendMail,
} = require("../controllers/transcations");
const { fileUploads } = require("../middlewares/fileUploads");

router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.post("/product", fileUploads, addProduct);
router.post("/order", orderProduct);

router.get("/transactions", getTransactions);
router.post("/transaction", addTransaction);
router.post("/notification", notification);

router.post("/mail-notification", sendMail);
module.exports = router;
