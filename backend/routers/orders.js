const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const express = require("express");

const ordersRouter = express.Router();

/////////// -------- GET --------- /////////////
ordersRouter.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  // HERE WE ARE POPULATING USER WITH THEIRS NAME

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});
ordersRouter.get(`/get/totalSales`, async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  // WE CANNOT RETURN AN OBJECT WITHOUT ID, SO WE CREATED AN PBJECT WITH _id = NULL;
  // A GROUP SPECIFICATION MUST INCLUDE id

  if (!totalSales) {
    res.status(400).send('The order sales cannot be generated');
  }
  res.send({totalSales:totalSales.pop().totalsales});
});

ordersRouter.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments();

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
});

ordersRouter.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        select: "name category -_id",
        populate: {
          path: "category",
          select: "name -_id",
        },
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

ordersRouter.get(`/get/userorders/:id`, async (req, res) => {
  const userorderlist = await Order.find({user:req.params.id})
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        select: "name category -_id",
        populate: {
          path: "category",
          select: "name -_id",
        },
      },
    }).sort({'dateOrdered':-1});

  if (!userorderlist) {
    res.status(500).json({ success: false });
  }
  res.send(userorderlist);
});

/////////// -------- PUT & POST --------- /////////////
ordersRouter.post("/", async (req, res) => {
  let {
    orderItems,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice,
    user,
  } = req.body;
  const orderItemsId = Promise.all(
    orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdResolved = await orderItemsId;

  const totalPrices = await Promise.all(
    orderItemsIdResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId)
      .populate("product","price");

      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice
    }));
    const finalPrice = totalPrices.reduce((a,b)=>a+b,0)

  let order = new Order({
    orderItems: orderItemsIdResolved,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice: finalPrice,
    user,
  });

  order = await order.save();
  if (!order) {
    return res
      .status(404)
      .json({ success: false, message: "The order cannot be placed" });
  } else {
    return res.status(200).send(order);
  }
});

ordersRouter.put("/:id", async (req, res) => {
  let id = req.params.id;
  let { status } = req.body;
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

  if (!order) {
    return res
      .status(404)
      .json({ success: false, message: "The order status cannot be updated" });
  } else {
    return res.status(200).send(order);
  }
});

/////////// -------- DELETE --------- /////////////
ordersRouter.delete("/:id", async (req, res) => {
  let id = req.params.id;
  Order.findByIdAndRemove(id)
    .then((order) => {
      if (order) {
        //AS WE ALSO NEED TO DELETED ORDERED ITEMS WITH ORDER
        order.orderItems.map(async (deleteOrderItem) => {
          await OrderItem.findByIdAndDelete(deleteOrderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "Order deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = ordersRouter;

/*
{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "61eaa3b22cdb45b73379db5f"
        },
        {
            "quantity": 2,
            "product" : "61eabf362cee432c6b77f716"
        }
    ],
    "shippingAddress1" : "Okhla",
    "shippingAddress2" : "73-A",
    "city": "Delhi",
    "zip": "110025",
    "country": "India",
    "phone": "+420702241333",
    "user": "61ef002a9d0d7a94a283ec1f"
}
*/
