const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.rendersignupForm) // Render signup form
  .post(userController.signup); // Handle signup

router
  .route("/login")
  .get(userController.renderLoginform) // Render login form
  .post(
    saveRedirectUrl, // Save redirect URL
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      successFlash: "Welcome back!",
    }),
    userController.login // Handle login
  );

router.get("/logout", userController.logout); // Handle logout

module.exports = router;