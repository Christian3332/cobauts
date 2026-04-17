const express = require('express');
const router = express.Router();
const paymentController = require('./payment-controller');
const auth = require('../../../core/auth-middleware');

module.exports = () => {
  router.get('/balance', auth, paymentController.checkBalance);
  router.post('/topup', auth, paymentController.topUp);
  router.get('/transactions', auth, paymentController.getHistory);

  return router;
};