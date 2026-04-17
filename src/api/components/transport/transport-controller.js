const transportService = require('./transport-service');

exports.getTypes = async (req, res) => {
  const types = transportService.getTipeKendaraan();
  res.json(types);
};

exports.estimate = async (req, res) => {
  try {
    const { type, distance } = req.body;
    const estimasi = transportService.hitungEstimasi(type, distance);
    res.json(estimasi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.request = async (req, res) => {
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

exports.getDetail = async (req, res) => {
  try {
    const order = await transportService.detailOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    await transportService.batalinOrder(req.params.id);
    res.json({ message: 'Order berhasil dibatalkan' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const order = await transportService.selesaikanOrder(req.params.id);
    res.json({ message: 'Perjalanan selesai!', data: order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
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

exports.getAllHistory = async (req, res) => {
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