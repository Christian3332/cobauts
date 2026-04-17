const express = require('express');
const usersController = require('./users-controller');
const auth = require('../../../core/auth-middleware');

module.exports = () => {
  const router = express.Router();

  //public
  router.post('/register', usersController.register);
  router.post('/login', usersController.login);

  //private
  router.get('/profile', auth, usersController.getProfile);
  router.get('/history', auth, usersController.history);
  router.put('/edit', auth, usersController.edit);
  router.put('/change-password', auth, usersController.changePassword);

  return router;
};
