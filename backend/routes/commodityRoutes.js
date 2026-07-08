const express = require("express");
const router = express.Router();
const { getCommodityPrices } = require("../controllers/commodityController");

router.get("/:name", getCommodityPrices);

module.exports = router;
