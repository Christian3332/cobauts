const paymentService = require("./payment-service");
const { errorResponder, errorTypes } = require("../../../core/errors");

async function checkBalance(request, response, next) {
  try {
    const userId = request.user.id;
    const balance = await paymentService.checkBalance(userId);

    if (!balance && balance !== 0) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Data saldo tidak ditemukan",
      );
    }

    return response.status(200).json(balance);
  } catch (error) {
    return next(error);
  }
}

async function topUp(request, response, next) {
  try {
    const { amount } = request.body;
    const userId = request.user.id;

    if (!amount) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Nominal top up harus diisi",
      );
    }

    if (amount <= 0) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Nominal top up tidak valid",
      );
    }

    const result = await paymentService.topUp(userId, amount);

    if (!result) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Gagal memproses top up",
      );
    }

    return response.status(200).json({
      message: "Top up berhasil!",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function pay(request, response, next) {
  try {
    const { amount } = request.body;
    const userId = request.user.id;

    if (!amount) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Jumlah pembayaran harus diisi",
      );
    }

    if (amount <= 0) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Jumlah pembayaran tidak valid",
      );
    }

    const result = await paymentService.pay(userId, amount);

    if (!result) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Pembayaran gagal diproses",
      );
    }

    return response.status(200).json({
      message: "Pembayaran berhasil!",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const userId = request.user.id;
    const history = await paymentService.getHistory(userId);

    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  checkBalance,
  topUp,
  pay,
  getHistory,
};
