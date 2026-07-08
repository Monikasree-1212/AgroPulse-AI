const express = require("express");
const router  = express.Router();
const {
  getAllSchemes,
  getSchemeById,
  searchSchemes,
  getMSPPrices,
} = require("../controllers/governmentSchemeController");

router.get("/schemes",      getAllSchemes);
router.get("/search",       searchSchemes);
router.get("/msp",          getMSPPrices);
router.get("/schemes/:id",  getSchemeById);

module.exports = router;
