const { User } = require('../../../models');


async function createUser(username, email, password, fullName) {
  return User.create({ username, email, password, fullName });
}

async function getUserByEmail (email) {
  return await User.findOne({ email: email });
};

async function getUserById (id) {
  return await User.findById(id);
};

async function update (id, data) {
  return User.findByIdAndUpdate(id, data, { new: true });
};

async function gantiPassword (id, passwordBaru) {
  return User.findByIdAndUpdate(id, { password: passwordBaru });
};

async function getUserOrders (userId) {
  return await Transport.find({ userId }).sort({ createdAt: -1 });
};

async function tambahSaldo (id, nominal) {
  return await User.findByIdAndUpdate(id, { $inc: { balance: nominal } }, { new: true });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  update,
  gantiPassword,
  getUserOrders,
  tambahSaldo,
};



