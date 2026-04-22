module.exports = (db) =>
  db.model(
    "Transport",
    db.Schema(
      {
        userId: {
          type: db.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        driverId: {
          type: db.Schema.Types.ObjectId,
          ref: "User",
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
          default: "e wallet",
        },
        paymentStatus: {
          type: String,
          default: "paid",
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
