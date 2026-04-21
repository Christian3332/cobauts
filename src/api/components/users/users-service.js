const usersRepository = require("./users-repository");
const transportRepository = require("../transport/transport-repository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../../../utils/password");

const SECRET = "KELOMPOK_8";

async function createUser(username, email, password, fullName) {
  return usersRepository.createUser(username, email, password, fullName);
}

async function emailExists(email) {
  const user = await usersRepository.getUserByEmail(email);
  return !!user;
}

async function checkLogin(email, password) {
  const user = await usersRepository.getUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
    expiresIn: "1d",
  });

  return { token, role: user.role };
}

async function getProfile(id) {
  return usersRepository.getUserById(id);
}

async function editUser(id, newData) {
  const dataUpdate = {
    fullName: newData.fullName,
    username: newData.username,
  };
  return usersRepository.update(id, dataUpdate);
}

async function updatePassword(id, newPassword) {
  const hashedPassword = await hashPassword(newPassword);
  return usersRepository.changePassword(id, hashedPassword);
}

module.exports = {
  createUser,
  emailExists,
  checkLogin,
  getProfile,
  editUser,
  updatePassword,
};
