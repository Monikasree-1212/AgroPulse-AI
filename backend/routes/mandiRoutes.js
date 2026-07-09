const express = require("express");
const router  = express.Router();
const { getAllMandis, getMandisByCommodity, recommendMandis, getMandiRecommendation } = require("../controllers/mandiController");

router.get("/",                        getAllMandis);
router.get("",                         getAllMandis);
router.get("/recommendation",          getMandiRecommendation);
router.get("/recommend/:commodity",    recommendMandis);
router.get("/:commodity",              getMandisByCommodity);

module.exports = router;
