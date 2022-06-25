const express = require("express");
const user = require("./../controllers/users");
const router = express.Router();

router.post('/signup',user.signup)
router.post('/signin',user.signin);
module.exports = router;