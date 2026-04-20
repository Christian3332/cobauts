const transportService = require('./transport-service');

async function getTypes (req, res) {
  const types = transportService.getTipeKendaraan();
  res.json(types);
};

async function estimate (req, res) {
  try {
    const { type, distance } = req.body;
    const estimasi = transportService.hitungEstimasi(type, distance);
    res.json(estimasi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function request (req, res) {
  try {
    // req.user.id didapat dari token login
    const order = await transportService.prosesRequestOrder(req.user.id, req.body);
    res.status(201).json({ 
      message: 'Driver berhasil ditemukan!', 
      data: order 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function getDetail (req, res) {
  try {
    const order = await transportService.detailOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function cancel (req, res, next) {
  try {
    // 1. Ambil ID dari URL (Ini yang bikin error 500 tadi!)
    const id = req.params.id;


    // 2. Lempar ID tersebut ke Service untuk diproses
    const result = await transportService.batalinOrder(id);
   
    // 3. Kembalikan response sukses ke Postman/EchoAPI
    return res.status(200).json({
      statusCode: 200,
      message: 'Order berhasil dibatalkan dan saldo dikembalikan',
      data: result
    });
  } catch (error) {
    // Kalau ada error (misal order tidak ketemu), lempar ke error handler
    next(error);
  }
};

async function completeOrder (req, res) {
  try {
    const order = await transportService.selesaikanOrder(req.params.id);
    res.json({ message: 'Perjalanan selesai!', data: order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function getHistory (req, res) {
  try {
    // req.user.id didapat dari token yang kamu masukkan di header
    const history = await transportService.getUserHistory(req.user.id);
    res.json({
      message: "Riwayat perjalanan berhasil diambil",
      data: history
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function getAllHistory (req, res) {
  try {
    // Panggil fungsi repository yang baru kita buat tadi
    const allHistory = await transportService.getAllHistoryAdmin();
    res.json({
      message: "Seluruh riwayat perjalanan berhasil ditarik (Admin Mode)",
      data: allHistory
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTypes,
  estimate,
  request,
  getDetail,
  cancel,
  completeOrder,
  getHistory,
  getAllHistory,
};