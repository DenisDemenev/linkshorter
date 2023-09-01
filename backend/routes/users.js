const router = require("express").Router();
const { getUser, getUserInfo } = require("../controllers/users");

const { userIdValidation } = require("../middlewares/validation");

router.get("/me", getUserInfo);

router.get("/:userId", userIdValidation, getUser);

module.exports = router;
