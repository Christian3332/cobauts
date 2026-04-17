const Payment = require('../../../models/payment-schema');

exports.buatTransaksi = async (data) => {
  return await Payment.create(data);
};

exports.cariRiwayatUser = async (userId) => {
  return await Payment.find({ userId }).sort({ createdAt: -1 });
};