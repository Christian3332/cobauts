const mongoose = require('mongoose');
const { User } = require('../../models');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();

// Gunakan nama 'drivers' secara konsisten
const drivers = [
  {
    fullName: "Rizky (Driver Bike 1)",
    email: "rizky.bike@mail.com",
    password: "password123",
    username: "rizky_bike",
    role: "driver"
  },
  {
    fullName: "Agus (Driver Bike 2)",
    email: "agus.bike@mail.com",
    password: "password123",
    username: "agus_bike",
    role: "driver"
  },
  {
    fullName: "Bambang (Driver Car 1)",
    email: "bambang.car@mail.com",
    password: "password123",
    username: "bambang_car",
    role: "driver"
  },
  {
    fullName: "Dewi (Driver Car 2)",
    email: "dewi.car@mail.com",
    password: "password123",
    username: "dewi_car",
    role: "driver"
  }
];

const seedDrivers = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Back-End-Ride-Hailing';
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB...");
    }

    // FIX 1: Gunakan nama variabel 'drivers' yang benar
    const hashedDrivers = await Promise.all(drivers.map(async (driver) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(driver.password, salt);
      return { ...driver, password: hashedPassword };
    }));

    // Hapus data lama agar tidak duplikat
    await User.deleteMany({ username: { $in: drivers.map(d => d.username) } });
    console.log("Old test drivers cleared.");

    // FIX 2: Masukkan 'hashedDrivers' ke Database, BUKAN 'drivers'
    const createdDrivers = await User.insertMany(hashedDrivers);
    
    console.log("\n--- COPY ID BERIKUT KE constants.js ---");
    createdDrivers.forEach(d => {
      console.log(`${d.fullName} -> ID: ${d._id}`);
    });
    console.log("---------------------------------------\n");

    setTimeout(() => {
      mongoose.connection.close();
      console.log("Connection closed.");
      process.exit(0);
    }, 1000);

  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDrivers();