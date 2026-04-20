const { Transport } = require("../../../models");

async function makeNewOrder(dataOrder) {
  return Transport.create(dataOrder);
}

async function getOrderById(id) {
  return Transport.findById(id)
    .populate("userId", "fullName email")
    .populate("driverId", "fullName");
}

async function updateStatusOrder(id, status) {
  return Transport.findByIdAndUpdate(id, { status: status }, { new: true });
}

async function getUserOrders(userId) {
  return Transport.find({ userId: userId }).sort({ createdAt: -1 });
}

async function getAllOrdersForAdmin() {
  return Transport.find().sort({ createdAt: -1 });
}

module.exports = {
  makeNewOrder,
  getOrderById,
  updateStatusOrder,
  getUserOrders,
  getAllOrdersForAdmin,
};
