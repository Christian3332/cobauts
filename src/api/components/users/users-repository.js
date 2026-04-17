const { User } = require('../../../models');

exports.simpan = async (data) => {
  return await User.create(data);
};

exports.cariLewatEmail = async (email) => {
  return await User.findOne({ email: email });
};

exports.cariLewatId = async (id) => {
  return await User.findById(id);
};

exports.update = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

exports.gantiPassword = async (id, passwordBaru) => {
  return User.findByIdAndUpdate(id, { password: passwordBaru });
};

exports.getUserOrders = async (userId) => {
  return await Transport.find({ userId }).sort({ createdAt: -1 });
};

exports.tambahSaldo = async (id, nominal) => {
  return await User.findByIdAndUpdate(id, { $inc: { balance: nominal } }, { new: true });
};



