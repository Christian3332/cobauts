const { User } = require("../../../models");

async function createUser(username, email, password, fullName) {
  return User.create({ username, email, password, fullName });
}

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getUserById(id) {
  return User.findById(id);
}

async function update(id, data) {
  return User.findByIdAndUpdate(id, { $set: data }, { new: true });
}

async function changePassword(id, hashedPassword) {
  return User.updateOne(
    { _id: id }, 
    { $set: { password: hashedPassword } }
  );
}

async function tambahSaldo(id, nominal) {
  return User.findByIdAndUpdate(
    id,
    { $inc: { balance: nominal } },
    { new: true },
  );
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  update,
  changePassword,
  tambahSaldo,
};
