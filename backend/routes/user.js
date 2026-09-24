const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const {signup,login,getProfile,logout} = require("../controllers/users.js");


// router.get("/signUp", userController.renderSignupForm);

router.post("/signup", signup);

// router.get("/login", userController.renderLoginForm);

router.post("/login",login);

router.get("/profile",getProfile);
router.post("/logout", logout);

module.exports = router;