const Order = require("../models/Order");
const Product = require("../models/Product");
const TestBox = require("../models/TestBox");

const createOrder = async (req, res, next) => {
  try {
    const { items, customerInfo, subtotal, shippingFee, grandTotal, paymentMethod } = req.body;
    if (!items || items.length === 0 || !customerInfo) {
      return res.status(400).json({ message: "Invalid order details." });
    }

    // Validate stock for each item before creating order
    for (const item of items) {
      const Model = item.productType === "TestBox" ? TestBox : Product;
      const dbItem = await Model.findById(item.product);
      if (!dbItem) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (dbItem.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${dbItem.name}". Available: ${dbItem.stock}, requested: ${item.quantity}.`
        });
      }
    }

    // Auto-generate a clean, unique order number
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SADI-${timestamp}-${random}`;

    const order = await Order.create({
      orderNumber,
      items,
      customerInfo,
      subtotal,
      shippingFee,
      grandTotal,
      paymentMethod: paymentMethod || "COD",
      status: "Pending",
    });

    // Deduct stock after successful order creation
    for (const item of items) {
      const Model = item.productType === "TestBox" ? TestBox : Product;
      await Model.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("items.product").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (status) order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};

