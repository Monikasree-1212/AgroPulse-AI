const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const commodityRoutes  = require("./routes/commodityRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const weatherRoutes    = require("./routes/weatherRoutes");
const mandiRoutes           = require("./routes/mandiRoutes");
const profitSimulatorRoutes    = require("./routes/profitSimulatorRoutes");
const governmentSchemeRoutes   = require("./routes/governmentSchemeRoutes");
const voiceAssistantRoutes     = require("./routes/voiceAssistantRoutes");
const locationRoutes           = require("./routes/locationRoutes");
const notificationRoutes       = require("./routes/notificationRoutes");
const activityRoutes           = require("./routes/activityRoutes");
const farmingTipsRoutes        = require("./routes/farmingTipsRoutes");
const analyticsRoutes          = require("./routes/analyticsRoutes");
const reportRoutes             = require("./routes/reportRoutes");
const authRoutes               = require("./routes/authRoutes");
const profileRoutes            = require("./routes/profileRoutes");
const { autoGenerateNotifications } = require("./controllers/notificationController");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("AgroPulse AI Backend Running"));
app.use("/api/commodities", commodityRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/mandis",  mandiRoutes);
app.use("/api/profit",      profitSimulatorRoutes);
app.use("/api/government",  governmentSchemeRoutes);
app.use("/api/voice",       voiceAssistantRoutes);
app.use("/api/location",    locationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities",     activityRoutes);
app.use("/api/farming-tips",   farmingTipsRoutes);
app.use("/api/analytics",      analyticsRoutes);
app.use("/api/reports",        reportRoutes);
app.use("/api/auth",           authRoutes);
app.use("/api/profile",        profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Run auto-generation after 5s (let DB connect), then every 30 min
  setTimeout(() => {
    autoGenerateNotifications()
    setInterval(autoGenerateNotifications, 30 * 60 * 1000)
  }, 5000)
});
