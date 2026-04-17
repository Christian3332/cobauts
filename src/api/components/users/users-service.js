const usersRepository = require('./users-repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Membaca
const transportRepository = require('../transport/transport-repository');
const SECRET = 'KELOMPOK_8';

exports.buatUser = async (data) => {
  // Hash password
  const hash = await bcrypt.hash(data.password, 10);
  data.password = hash;

  return await usersRepository.simpan(data);
};  

exports.prosesLogin = async (email, password) => {
  const user = await usersRepository.cariLewatEmail(email);
  if (!user) throw new Error('User tidak ditemukan.');

  const cocok = await bcrypt.compare(password, user.password);
  if (!cocok) throw new Error('Password salah.');

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
      }, 
      SECRET, 
      { expiresIn: '1d' });
  return { token, role: user.role };
};

exports.ambilProfil = async (id) => {
  const user = await usersRepository.cariLewatId(id);
  if (!user) throw new Error('User tidak ditemukan');
  return user;
};

exports.editUser = async (id, dataBaru) => {
  // Kita batasi apa saja yang boleh diedit (biar password/balance gak bocor lewat sini)
  const dataUpdate = {
    fullName: dataBaru.fullName,
    username: dataBaru.username,
  };
  return usersRepository.update(id, dataUpdate);
};

exports.updatePassword = async (id, passBaru) => {
  const hash = await bcrypt.hash(passBaru, 10);
  return usersRepository.gantiPassword(id, hash);
};

exports.getHistory = async (userId) => {
  // Memanggil fungsi dari transportRepository yang sudah di-require di atas
  return await transportRepository.getUserOrders(userId);
};