const mongoose = require('mongoose');
const { User } = require('../../models');
const bcrypt = require('bcryptjs'); // Tambahkan bcrypt untuk hash password
require('dotenv').config();

const adminData = {
  fullName: "Super Admin UTS",
  email: "admin@mail.com",
  password: "admin123", // Nanti di-hash
  username: "admin_utama",
  role: "admin" // Kunci perbedaannya di sini
};

const seedAdmin = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Back-End-Ride-Hailing';
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB for Admin Seeding...");
    }

    // Hapus admin lama biar tidak duplikat
    await User.deleteMany({ username: adminData.username });
    console.log("Old admin cleared.");

    // HASH PASSWORD: Penting! Kalau tidak di-hash, admin tidak akan bisa login
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    const createdAdmin = await User.create(adminData);
    
    console.log("\n--- ADMIN BERHASIL DIBUAT ---");


    setTimeout(() => {
      mongoose.connection.close();
      console.log("Connection closed.");
      process.exit(0);
    }, 1000);

  } catch (error) {
    console.error("Seeding Admin error:", error);
    process.exit(1);
  }
};

seedAdmin();