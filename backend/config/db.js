const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("=============================");
    console.log("Connected Database: SUCCESS");
    console.log("Database Name:", conn.connection.db.databaseName);
    
    // Print all available collections in this specific database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collection Names:", collections.map(c => c.name).join(", "));
    console.log("=============================");

  } catch (error) {
    console.error("Database Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
