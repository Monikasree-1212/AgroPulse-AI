require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {})
  .then(async () => {
    const db = mongoose.connection.db;
    const res = await db.collection("governmentschemes").updateMany(
      { officialLink: { $exists: true } },
      { $rename: { officialLink: "website" } }
    );
    console.log("Successfully updated DB:", res.modifiedCount);
    process.exit(0);
  })
  .catch((e) => {
    console.error("DB Error:", e);
    process.exit(1);
  });
