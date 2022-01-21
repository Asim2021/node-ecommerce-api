const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");

const productsRouter = express.Router();

/////////// --------GET--------- /////////////
productsRouter.get("/", async (req, res) => {
  
  const productList = await Product.find().select("name image -_id"); // or ['name','image','-_id']
  if (!productList) {
    res.send(500).json({ success: false });
  } else {
    res.send(productList);
  }
});

productsRouter.get("/full", async (req, res) => {
  
  const productList = await Product.find()
  if (!productList) {
    res.send(500).json({ success: false });
  } else {
    res.send(productList);
  }
});

productsRouter.get("/:id", async (req, res) => {
  let ID = req.params.id;
  const product = await Product.findById(ID).populate("category");
  if (!product) {
    res.send(500).json({ success: false });
  } else {
    res.send(product);
  }
});

productsRouter.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

productsRouter.get(`/get/featured/:count`, async (req, res) => {
  const count = +req.params.count
  const products = await Product.find({ isFeatured: true }).limit(count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

productsRouter.get(`/get/featured/`, async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(100);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

productsRouter.get(`/`, async (req, res) =>{
  // localhost:3005/api/v1/products?categories=2342342,234234
  let filter = {};
  if(req.query.categories)
  {
       filter = {category: req.query.categories.split(',')}
  }

  const productList = await Product.find(filter).populate('category');

  if(!productList) {
      res.status(500).json({success: false})
  } 
  res.send(productList);
})

/////////// --------PUT & POST--------- /////////////
productsRouter.post("/", async (req, res) => {
  let {
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  let categoryInReq = await Category.findById(category);
  if (!categoryInReq) return res.status(400).send("Invalid Category");

  let product = new Product({
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  });
  product = await product.save();
  if (!product)
    res
      .status(500)
      .json({ msg: "The product cannot be created", err: new Error() });
  res.send(product);
});

productsRouter.put("/:id", async (req, res) => {
  let id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid Product Id");
  }
  let {
    name,
    description,
    richDescription,
    image,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  let categoryInReq = await Category.findById(category);
  if (!categoryInReq) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
    },
    { new: true } // to get new data in return, as by default it returns old data
  );
  if (!product) {
    return res
      .status(400)
      .json({ success: false, message: "The product cannot be updated" });
  } else {
    return res.status(200).send(product);
  }
});

/////////// --------DELETE--------- /////////////
productsRouter.delete("/:id", (req, res) => {
  let id = req.params.id;
  Product.findByIdAndRemove(id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "product deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = productsRouter;
