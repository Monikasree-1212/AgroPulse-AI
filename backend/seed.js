const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Commodity = require("./models/Commodity");
const Mandi = require("./models/Mandi");
const GovernmentScheme = require("./models/GovernmentScheme");
const User = require("./models/User");
const Activity = require("./models/Activity");
const Notification = require("./models/Notification");
const Analytics = require("./models/Analytics");
const Report = require("./models/Report");

const sampleData = require("./data/sampleData");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await Commodity.deleteMany({});
    console.log("Existing commodity data cleared");
    await Commodity.insertMany(sampleData.commodities);
    console.log("Commodities seeded successfully");

    await Mandi.deleteMany({});
    console.log("Existing mandi data cleared");
    await Mandi.insertMany(sampleData.mandis);
    console.log("Mandis seeded successfully");

    await GovernmentScheme.deleteMany({});
    console.log("Existing scheme data cleared");
    await GovernmentScheme.insertMany(sampleData.governmentSchemes);
    console.log(`Government schemes seeded successfully - ${sampleData.governmentSchemes.length} records`);
    
    // Check users etc
    const userCount = await User.countDocuments();
    if(userCount === 0) {
        await User.insertMany(sampleData.users);
        console.log("Users seeded");
    }

  } catch (error) {
    console.error("Seed Error:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seed();
