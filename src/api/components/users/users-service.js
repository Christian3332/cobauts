const usersRepository = require('./users-repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transportRepository = require('../transport/transport-repository');
const SECRET = 'KELOMPOK_8';

async function createUser(username, email, password, fullName) {
  return usersRepository.createUser(username, email, password, fullName);
}

async function emailExists(email) {
  const user = await usersRepository.getUserByEmail(email);
  return !!user; // Return true if user exists, false otherwise
}

async function checkLogin (email, password) {
  const user = await usersRepository.getUserByEmail(email);
  if (!user) throw new Error('User tidak ditemukan.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Password salah.'); 

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    }, 
    SECRET, 
    { 
      expiresIn: '1d' 
    });

  return { token, role: user.role };
}

async function getProfile (id) {
  const user = await usersRepository.getUserById(id);
  if (!user) throw new Error('User tidak ditemukan');
  return user;
};

async function getHistory (userId) {
  return await transportRepository.getUserOrders(userId);
};

async function editUser (id, dataBaru) {
  // Kita batasi apa saja yang boleh diedit (biar password/balance gak bocor lewat sini)
  const dataUpdate = {
    fullName: dataBaru.fullName,
    username: dataBaru.username,
  };
  return usersRepository.update(id, dataUpdate);
};

async function updatePassword (id, passBaru) {
  const hash = await bcrypt.hash(passBaru, 10);
  return usersRepository.gantiPassword(id, hash);
};

async function refundBalance (userId, amountToRefund) {
  // $inc akan menambahkan saldo secara otomatis
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: amountToRefund } },
    { new: true } // Tidak ada tambahan session di sini
  );


  if (!user) {
    throw new Error('User tidak ditemukan saat proses refund');
  }
 
  return user;
}


module.exports = {
  createUser,
  emailExists,
  checkLogin,
  getProfile,
  editUser,
  updatePassword,
  getHistory,
};