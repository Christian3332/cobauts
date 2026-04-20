module.exports = (db) =>
  db.model(
    "Users",
    db.Schema({
        username: { 
          type: String, 
          required: true, 
          unique: true 
        },
        email: { 
          type: String, 
          required: true, 
          unique: true 
        },
        password: { 
          type: String, 
          required: true 
        },
        fullName: String,
        balance: { 
          type: Number, 
          default: 0 
        },
        role: {
          type: String,
          enum: ["user", "admin", "driver"],
          default: "user",
        },
      },
      { timestamps: true, versionKey: false },
    ),
  );
