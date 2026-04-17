const usersService = require('./users-service');

exports.register = async (req, res) => {
  try {
    const hasil = await usersService.buatUser(req.body);
    res.status(201).json({ status: 'Sukses', data: hasil });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dataLogin = await usersService.prosesLogin(email, password);
    res.json({ message: 'Login Berhasil', ...dataLogin });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await usersService.ambilProfil(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const update = await usersService.editUser(req.user.id, req.body);
    res.json({ message: 'Profil berhasil diupdate', data: update });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { passwordBaru } = req.body;
    await usersService.updatePassword(req.user.id, passwordBaru);
    res.json({ message: 'Nicee password kamu telah diganti' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ... kode yang sudah ada ...

exports.history = async (req, res) => {
  try {
    // req.user.id didapat dari middleware auth
    const historyData = await usersService.getHistory(req.user.id);
    res.json({ 
      message: 'Riwayat perjalanan berhasil diambil', 
      data: historyData 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


