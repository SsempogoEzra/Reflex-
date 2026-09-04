const express = require("express");

const {
    getUsers,
    getRiders,
    getDispatchers
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/riders", getRiders);
router.get("/dispatchers", getDispatchers);

module.exports = router;