module.exports = (db) => {
  const userSchema = db.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      fullName: String,
      balance: { type: Number, default: 0 },
      // TAMBAHKAN ROLE DI SINI
      role: { 
        type: String, 
        enum: ["user", "admin"],  
        default: "user" 
      },
    },
    { timestamps: true, versionKey: false },
  );    
  return db.model("User", userSchema);
};