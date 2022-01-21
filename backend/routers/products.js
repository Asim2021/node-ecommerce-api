const express = require("express");
const Product = require("../models/product");

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  const productList = await Product.find();
  if (!productList) {
    res.send(500).json({ success: false });
  } else {
    res.send(productList);
  }
});

productsRouter.post("/", (req, res) => {
  let { name, image, countInStock } = req.body;
  let product = new Product({
    name,
    image,
    countInStock,
  });
  product
    .save()
    .then((product) => res.status(201).json(product))
    .catch((err) => {
      res.status(400).send("unable to save to database", err);
    });
});

module.exports = productsRouter;