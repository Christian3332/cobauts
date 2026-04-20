const Payment = require('../../../models/payment-schema');

exports.buatTransaksi = async (data) => {
  return await Payment.create(data);
};

exports.cariRiwayatUser = async (userId) => {
  return await Payment.find({ userId }).sort({ createdAt: -1 });
};

exports.tambahSaldoUser = async (userId, amount) => {
  // Trik Jitu: Kita ambil model User yang SUDAH dicetak oleh sistem Anda.
  // Gunakan mongoose.model('User') dengan SATU parameter saja untuk mengambil data, bukan membuat baru.
  const User = mongoose.model('User');


  return await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } },
    { new: true }
  );
};
