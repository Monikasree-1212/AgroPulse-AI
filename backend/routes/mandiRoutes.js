const express = require("express");
const router  = express.Router();
const { getAllMandis, getMandisByCommodity, recommendMandis } = require("../controllers/mandiController");

router.get("/",                        getAllMandis);
router.get("/recommend/:commodity",    recommendMandis);
router.get("/:commodity",              getMandisByCommodity);

module.exports = router;
