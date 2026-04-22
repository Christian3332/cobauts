module.exports = (db) =>
  db.model(
    "Payment",
    db.Schema(
      {
        userId: {
          type: db.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["topup", "payment"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
      { timestamps: true, versionKey: false },
    ),
  );
