module.exports = (db) =>
  db.model(
    "Transports",
    db.Schema(
      {
        userId: {
          type: db.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
        driverId: {
          type: db.Schema.Types.ObjectId,
          ref: "Users",
          required: false,
          default: null,
        },
        type: { 
          type: String, 
          enum: ["car", "bike"], 
          required: true },
        origin: { 
          type: String, 
          required: true 
        },
        destination: { 
          type: String, 
          required: true 
        },
        distance: { 
          type: Number, 
          required: true 
        },
        price: { 
          type: Number, 
          required: true 
        },
        paymentMethod: {
          type: String,
          enum: ["cash", "saldo"],
          default: "cash",
        },
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "failed"],
          default: "pending",
        },
        status: {
          type: String,
          enum: ["ongoing", "completed", "cancelled"],
          default: "ongoing",
          required: true,
        },
      },
      { timestamps: true, versionKey: false },
    ),
  );
