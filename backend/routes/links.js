const router = require("express").Router();
const { createLink, getLinks } = require("../controllers/links");

router.post("/", createLink);
router.get("/all", getLinks);

module.exports = router;
