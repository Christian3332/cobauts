const { Transport } = require('../../../models');

async function buatOrderBaru (dataOrder) {
  return Transport.create(dataOrder);
};

async function ambilOrderLewatId (id) {
  return Transport.findById(id).populate('userId', 'fullName email').populate('driverId', 'fullName');
};

async function updateStatusOrder (id, status) {
  return Transport.findByIdAndUpdate(id, { status: status }, { new: true });
};

async function getUserOrders (userId) {
  return await Transport.find({ userId: userId })  
    .sort({ createdAt: -1 });
};

async function getAllOrdersForAdmin () {
  return await Transport.find()
    .sort({ createdAt: -1 });
};

module.exports = {
  buatOrderBaru,
  ambilOrderLewatId,
  updateStatusOrder,
  getUserOrders,
  getAllOrdersForAdmin
};
