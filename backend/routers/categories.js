const Category = require("../models/category");
const express = require("express");

const categoryRouter = express.Router();

/////////// --------GET--------- /////////////
categoryRouter.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});
categoryRouter.get(`/:id`, async (req, res) => {
  let id = req.params.id;
  const category = await Category.findById(id);

  if (!category) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(category);
});

/////////// --------PUT & POST--------- /////////////
categoryRouter.post("/", async (req, res) => {
  let { name, icon, color } = req.body;
  let category = new Category({ name, icon, color });
  category = await category.save();
  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "The category cannot be created" });
  } else {
    return res.status(200).send(category);
  }
});

categoryRouter.put("/:id", async (req, res) => {
  let id = req.params.id;
  let { name, icon, color } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name, icon, color },
    { new: true } // to get new data in return, as by default it returns old data
  );
  if (!category) {
    return res
      .status(400)
      .json({ success: false, message: "The category cannot be updated" });
  } else {
    return res.status(200).send(category);
  }
});

/////////// --------DELETE--------- /////////////
categoryRouter.delete("/:id", (req, res) => {
  let id = req.params.id;
  Category.findByIdAndRemove(id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "category deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = categoryRouter;
