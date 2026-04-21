const transportService = require("./transport-service");
const { errorResponder, errorTypes } = require("../../../core/errors");

async function getTypes(request, response, next) {
  try {
    const types = await transportService.getTypes();
    return response.status(200).json(types);
  } catch (error) {
    return next(error);
  }
}

async function estimate(request, response, next) {
  try {
    const { type, distance } = request.body;

    if (!type || !distance) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Tipe dan jarak harus diisi",
      );
    }

    const estimate = await transportService.countEstimate(type, distance);
    return response.status(200).json(estimate);
  } catch (error) {
    return next(error);
  }
}

async function requestOrder(request, response, next) {
  try {
    const { type, origin, destination, distance, price } = request.body;

    if (!type || !origin || !destination || !distance || !price) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Semua data pesanan (type, origin, destination, distance, price) wajib diisi",
      );
    }

    const userId = request.user.id;
    const orderResult = await transportService.processRequestOrder(userId, {
      type,
      origin,
      destination,
      distance,
      price,
    });

    if (!orderResult) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Gagal memproses pesanan driver",
      );
    }

    return response.status(201).json({
      message: "Driver berhasil ditemukan!",
      data: orderResult,
    });
  } catch (error) {
    return next(error);
  }
}

async function getDetail(request, response, next) {
  try {
    const order = await transportService.detailOrder(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "Order tidak ditemukan");
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

async function cancel(request, response, next) {
  try {
    const id = request.params.id;
    const result = await transportService.cancelOrder(id);

    return response.status(200).json({
      message: "Order berhasil dibatalkan dan saldo dikembalikan",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function completeOrder(request, response, next) {
  try {
    const order = await transportService.completeOrder(request.params.id);

    return response.status(200).json({
      message: "Perjalanan selesai!",
      data: order,
    });
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const userId = request.user.id;
    const history = await transportService.getUserHistory(userId);

    return response.status(200).json({
      message: "Riwayat perjalanan berhasil diambil",
      data: history,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAllHistory(request, response, next) {
  try {
    const allHistory = await transportService.getAllHistoryAdmin();

    return response.status(200).json({
      message: "Seluruh riwayat perjalanan berhasil ditarik (Admin Mode)",
      data: allHistory,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getTypes,
  estimate,
  requestOrder,
  getDetail,
  cancel,
  completeOrder,
  getHistory,
  getAllHistory,
};
