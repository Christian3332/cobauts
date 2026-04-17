// src/api/components/payment/payment-service.js
const paymentRepository = require('./payment-repository');
const usersRepository = require('../users/users-repository');

exports.topUp = async (userId, amount) => {
  await usersRepository.tambahSaldo(userId, amount);
  return await paymentRepository.buatTransaksi({
    userId,
    type: 'topup',
    amount,
    description: `Top up saldo sebesar ${amount}`
  });
};

// Fungsi ini tidak punya route sendiri, tapi dipanggil oleh TransportService
exports.potongSaldoOtomatis = async (userId, amount, orderId) => {
  const user = await usersRepository.cariLewatId(userId);
  
  // Cek apakah saldo cukup
  if (user.balance < amount) {
    throw new Error('Balance gak cukup, silakan top up dulu bos!');
  }

  // Kurangi saldo
  await usersRepository.tambahSaldo(userId, -amount);

  // Catat transaksi dengan keterangan orderId agar jelas duitnya buat apa
  return await paymentRepository.buatTransaksi({
    userId,
    type: 'payment',
    amount,
    description: `Pembayaran otomatis order: ${orderId}`
  });
};

exports.getHistory = async (userId) => {
  // Kita panggil fungsi cariRiwayatUser yang sudah kita buat di repository
  const history = await paymentRepository.cariRiwayatUser(userId);
  
  if (!history) {
    return []; // Kalau kosong kasih array kosong aja biar gak error di frontend
  }

  return history;
};