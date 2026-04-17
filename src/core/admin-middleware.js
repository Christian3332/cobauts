module.exports = (req, res, next) => {
  console.log('--- CEK ROLE USER ---');
  console.log('User Data:', req.user); // Liat di terminal, ada gak role: "admin"?

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Akses Ditolak!' });
  }
};