const paymentService = require("../payment/payment-service");
const transportRepository = require("./transport-repository");
const {
  LIST_DRIVER_BIKE,
  LIST_DRIVER_CAR,
  VEHICLE_TYPE,
} = require("../../../utils/constants");

async function getTypes() {
  return VEHICLE_TYPE;
}

async function countEstimate(type, distance) {
  const info = VEHICLE_TYPE[type];
  if (!info) throw new Error("Tipe kendaraan tidak tersedia");

  return {
    type,
    distance: Number(distance),
    countEstimate : info.pricePerKm * distance,
  };
}

async function processRequestOrder(userId, data) {
  const totalPrice = Number(data.price);
  if (!totalPrice || totalPrice <= 0) throw new Error("Harga tidak valid");

  await paymentService.processAutoPayment(
    userId,
    totalPrice,
    "TRP-" + Date.now(),
  );

  const list = data.type === "bike" ? LIST_DRIVER_BIKE : LIST_DRIVER_CAR;
  if (!list || list.length === 0) throw new Error("Driver tidak tersedia");

  const randomDriver = list[Math.floor(Math.random() * list.length)];

  const dataOrder = {
    userId: userId,
    driverId: randomDriver,
    type: data.type,
    origin: data.origin,
    destination: data.destination,
    distance: Number(data.distance),
    price: totalPrice,
    status: "ongoing",
    paymentStatus: "paid",
  };

  return transportRepository.makeNewOrder(dataOrder);
}

async function detailOrder(id) {
  return transportRepository.getOrderById(id);
}

async function cancelOrder(id) {
  return transportRepository.updateStatusOrder(id, "cancelled");
}

async function completeOrder(id) {
  return transportRepository.updateStatusOrder(id, "completed");
}

async function getUserHistory(userId) {
  return transportRepository.getUserOrders(userId);
}

async function getAllHistoryAdmin() {
  return transportRepository.getAllOrdersForAdmin();
}

module.exports = {
  getTypes,
  countEstimate,
  processRequestOrder,
  detailOrder,
  cancelOrder,
  completeOrder,
  getUserHistory,
  getAllHistoryAdmin,
};
