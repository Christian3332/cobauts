const paymentService = require('../payment/payment-service');
const transportRepository = require('./transport-repository');
const { LIST_DRIVER_BIKE, LIST_DRIVER_CAR, TIPE_KENDARAAN } = require('../../../utils/constants');

exports.getTipeKendaraan = () => {
  return TIPE_KENDARAAN;
};

exports.hitungEstimasi = (tipe, jarak) => {
  const info = TIPE_KENDARAAN[tipe];
  if (!info) throw new Error('Tipe kendaraan tidak tersedia');
  
  return {
    tipe,
    jarak: Number(jarak),
    estimasiHarga: info.hargaPerKm * jarak
  };
};

exports.prosesRequestOrder = async (userId, data) => {
  // 1. Tentukan harga (pastikan data.price ada di body request EchoAPI)
  const totalHarga = Number(data.price);
  if (!totalHarga || totalHarga <= 0) throw new Error('Harga tidak valid');

  // 2. POTONG SALDO DULU (Panggil Payment Service)
  // Kalau saldo kurang, kodingan di bawahnya otomatis gak akan jalan
  await paymentService.potongSaldoOtomatis(userId, totalHarga, "TRP-" + Date.now());

  // 3. Logika pilih driver (yang sudah kamu buat)
  const list = data.type === 'bike' ? LIST_DRIVER_BIKE : LIST_DRIVER_CAR;
  if (!list || list.length === 0) throw new Error('Driver tidak tersedia');
  const driverAcak = list[Math.floor(Math.random() * list.length)];

  // 4. Susun data order
  const dataOrder = {
    userId: userId,
    driverId: driverAcak,
    type: data.type,
    origin: data.origin,
    destination: data.destination,
    distance: Number(data.distance),
    price: totalHarga,
    status: 'ongoing', // Status perjalanan dimulai
    paymentStatus: 'paid' // Tambahkan ini di schema transport jika perlu
  };

  // 5. Simpan ke database
  return await transportRepository.buatOrderBaru(dataOrder);
};

exports.detailOrder = async (id) => {
  return transportRepository.ambilOrderLewatId(id);
};

exports.batalinOrder = async (id) => {
  return transportRepository.updateStatusOrder(id, 'cancelled');
};

exports.selesaikanOrder = async (id) => {
  // Update status ke 'completed'
  return transportRepository.updateStatusOrder(id, 'completed');
};

exports.getUserHistory = async (userId) => {
  return transportRepository.getUserOrders(userId);
};

exports.getAllHistoryAdmin = async () => {
  // Service memanggil fungsi di repository
  return await transportRepository.getAllOrdersForAdmin();
};

