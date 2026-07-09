const express = require("express");
const router  = express.Router();
const {
  getAllSchemes,
  getSchemeById,
  searchSchemes,
  getMSPPrices,
} = require("../controllers/governmentSchemeController");

router.get("/",           getAllSchemes);   // GET /api/government
router.get("",            getAllSchemes);   // GET /api/government
router.get("/schemes",    getAllSchemes);   // GET /api/government/schemes
router.get("/search",     searchSchemes);  // GET /api/government/search
router.get("/msp",        getMSPPrices);   // GET /api/government/msp
router.get("/schemes/:id",getSchemeById);  // GET /api/government/schemes/:id

module.exports = router;
