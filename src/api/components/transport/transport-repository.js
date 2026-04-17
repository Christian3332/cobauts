const { Transport } = require('../../../models');

exports.buatOrderBaru = async (data) => {
  return Transport.create(data);
};

exports.ambilOrderLewatId = async (id) => {
  return Transport.findById(id).populate('userId', 'fullName email').populate('driverId', 'fullName');
};

exports.updateStatusOrder = async (id, status) => {
  return Transport.findByIdAndUpdate(id, { status: status }, { new: true });
};

exports.getUserOrders = async (userId) => {
  return await Transport.find({ userId: userId })  
    .sort({ createdAt: -1 });
};

exports.getAllOrdersForAdmin = async () => {
  return await Transport.find()
    .sort({ createdAt: -1 });
};