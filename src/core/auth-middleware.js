const jwt = require('jsonwebtoken');
const SECRET = 'KELOMPOK_8';

module.exports = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Ini akan berisi { id, role } sesuai service kamu
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token lo salah atau udah basi.' });
  }
};
