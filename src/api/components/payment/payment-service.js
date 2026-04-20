const paymentRepository = require("./payment-repository");
const usersRepository = require("../users/users-repository");

async function topUp(userId, amount) {
  await usersRepository.updateBalance(userId, amount);

  return paymentRepository.createTransaction(
    userId,
    "topup",
    amount,
    `Top up saldo sebesar ${amount}`,
  );
}

async function processAutoPayment(userId, amount, orderId) {
  const user = await usersRepository.getUserById(userId);

  if (user.balance < amount) {
    throw new Error("Saldo tidak mencukupi");
  }

  await usersRepository.updateBalance(userId, -amount);

  return paymentRepository.createTransaction(
    userId,
    "payment",
    amount,
    `Pembayaran otomatis order: ${orderId}`,
  );
}

async function getHistory(userId) {
  const history = await paymentRepository.getUserHistory(userId);

  if (!history) {
    return [];
  }

  return history;
}

module.exports = {
  topUp,
  processAutoPayment,
  getHistory,
};
