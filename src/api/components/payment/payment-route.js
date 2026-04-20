const express = require('express');
const router = express.Router();
const paymentController = require('./payment-controller');
const adminOnly = require('../../../core/admin-middleware');
const auth = require('../../../core/auth-middleware');

module.exports = () => {
  router.post('/topup', auth, paymentController.topUp);
  router.get('/transactions', auth, paymentController.getHistory);

  return router;
};