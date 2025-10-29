const express = require("express");
const { scrapeGoogle } = require("../controllers/scraperController");

const router = express.Router();

router.get("/", scrapeGoogle);

module.exports = router;
