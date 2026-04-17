const paymentService = require('./payment-service');

exports.checkBalance = async (req, res) => {
  try {
    const balance = await paymentService.checkBalance(req.user.id);
    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.topUp = async (req, res) => {
  try {
    const { amount } = req.body;
    const result = await paymentService.topUp(req.user.id, amount);
    res.status(200).json({ message: 'Top up berhasil!', data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.pay = async (req, res) => {
  try {
    const { amount } = req.body;
    const result = await paymentService.pay(req.user.id, amount);
    res.status(200).json({ message: 'Pembayaran berhasil!', data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await paymentService.getHistory(req.user.id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};